import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import * as fromStore from '../store/reducers';
import { authActions } from '../store/actions';
import * as jwt_decode from 'jwt-decode';
import { map, take, takeWhile } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthState } from '../store/reducers/auth.reducer';
import { AppState } from '../store/reducers';
import { DecodedJwt } from '../interfaces/decoded-jwt';
import { User } from '../interfaces/user';
import { PendingProcesses } from '../interfaces/pending-processes';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _authData: any;

  private _api: String = 'http://localhost:3000/api';
  private _auth: AuthState;
  private _decodedJwt: DecodedJwt;
  private _user: User;
  private _pendingProcesses: PendingProcesses = <PendingProcesses>{};
  private _storeJwt: string;

  constructor(private _router: Router,
    private _http: HttpClient,
    private _store: Store<AppState>
  ) {
    this._auth = <AuthState>{};
    this._storeJwt = localStorage.getItem('jwt');
    setTimeout(() => {
      this._store.select(fromStore.getAuthState).subscribe(auth => {
        this._auth = auth;
        console.log(auth);
      });
      this._store.select(fromStore.getDecodeJwt).subscribe(decodeJwt => {
        this._decodedJwt = decodeJwt;
      });
      this._store.select(fromStore.getUserInfo).subscribe(user => {
        this._user = user;
      });
      this._store.select(fromStore.getPendingProcesses).subscribe(pendingProcesses => {
        this._pendingProcesses = pendingProcesses;
      });
      if (this._auth.jwt !== this._storeJwt) {
        this._store.dispatch(new authActions.SetJwt({ jwt: this._storeJwt }));
      }
    }, 50);
  }

  localLogin(email: string, password: string, roleId: any, tfaId: number = null, tfaToken: string = null) {
    return this._http.post(`${this._api}/auth/localLogin`, {
      Email: email,
      Password: password,
      RoleId: roleId,
      tfaId,
      tfaToken
    }, { withCredentials: true }).pipe(
      map(response => response['token'])
    );
  }

  signup(email: string, password: string, roleId: string) {
    return this._http.post(`${this._api}/auth/signup`, {
      RoleId: roleId,
      RegisterTypeId: 1,
      ConfirmEmailUrl: 'http://localhost:8080/emailConfirmation',
      UserData: {
        Email: email,
        Password: password
      }
    }, { withCredentials: true }).pipe(
      map(response => response['token'])
    );
  }

  generateLocalTfaToken(email: string, subject: string, message: string) {
    return this._http.get(`${this._api}/auth/generateLocalTfaToken/${email}`, {
      params: {
        Subject: subject,
        Message: message
      }
    }).toPromise();
  }

  socialLogin(userData: any) {
    return this._http.post(`${this._api}/auth/socialLogin`, userData).toPromise();
  }

  login(jwt: string) {
    this._store.select(fromStore.getLoadingProcesses)
      .pipe(
        takeWhile(loadingProcesses => loadingProcesses.length > 0, true)
      )
      .subscribe(loadingProcesses => {
        if (loadingProcesses.length === 0) {
          if (this._auth.jwt !== this._storeJwt && this._auth.jwt !== undefined) {
            setTimeout(() => {
              const priviliges = this._decodedJwt.Privileges ? this._decodedJwt.Privileges : [];
              const adminPanelAccess = priviliges.some(privilege => privilege.Code === 'AP');
              localStorage.setItem('jwt', jwt);
              this._storeJwt = jwt;
              if (adminPanelAccess) {
                this._router.navigate(['/admin/home']);
              } else {
                this._router.navigate(['/user/profile']);
              }
            }, 500);
          }
        }
      });
  }

  logout() {
    if (this._auth.jwt !== this._storeJwt && this._auth.jwt !== undefined) {
      localStorage.removeItem('jwt');
      this._router.navigate(['/']);
    }
  }

  decodeJwt(jwt: string): DecodedJwt {
    try {
      const jwtObject = jwt_decode(jwt);
      const decodeJwt = {
        Oid: jwtObject.Oid,
        Privileges: jwtObject.Privileges,
        Exp: new Date(jwtObject.exp * 1000),
        Iat: new Date(jwtObject.iat * 1000),
      };
      return decodeJwt;
    } catch (Error) {
      return <DecodedJwt>{};
    }
  }

  getDecodedAccessToken(token: string): any {
    try {
      const jwtDecoded = jwt_decode(token);
      jwtDecoded.exp = new Date(jwtDecoded.exp * 1000);
      jwtDecoded.iat = new Date(jwtDecoded.iat * 1000);
      jwtDecoded.user.Phone = jwtDecoded.user.Phone ? JSON.parse(jwtDecoded.user.Phone) : {};
      return jwtDecoded;
    } catch (Error) {
      return null;
    }
  }

  isAuth(noAuth = false): boolean {
    let isAuth = !!this._auth.isAuth;
    if (noAuth) {
      isAuth = !isAuth;
    }
    if (!isAuth && !noAuth) {
      this.logout();
    } else if (!isAuth && noAuth) {
      this._router.navigate(['/']);
    }
    return isAuth;
  }

  isUser(): boolean {
    const priviliges = this._decodedJwt.Privileges ? this._decodedJwt.Privileges : [];
    const isUser = priviliges.some(privilege => privilege.Code === 'UP');
    if (!isUser) {
      this._router.navigate(['/admin']);
    }
    return isUser;
  }

  isAdmin(): boolean {
    const priviliges = this._decodedJwt.Privileges ? this._decodedJwt.Privileges : [];
    const isSuperAdmin = priviliges.some(privilege => privilege.Code === 'AP');
    if (!isSuperAdmin) {
      this._router.navigate(['/']);
    }
    return isSuperAdmin;
  }

  isSuperAdmin() {
    const priviliges = this._decodedJwt.Privileges ? this._decodedJwt.Privileges : [];
    const isSuperAdmin = priviliges.some(privilege => privilege.Code === 'CA');
    if (!isSuperAdmin) {
      this._router.navigate(['/admin']);
    }
    return isSuperAdmin;
  }

  isRegisterCompleted(): boolean {
    const isRegisterCompleted = !this._pendingProcesses.CompleteRegister;
    if (!isRegisterCompleted) {
      this._router.navigate(['/user/profile']);
    }
    return isRegisterCompleted;
  }

}
