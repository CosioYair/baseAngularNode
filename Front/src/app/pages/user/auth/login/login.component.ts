import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LanguageConfig } from 'src/app/language-config';
import { Observable, Subscription } from 'rxjs';
import { Language } from 'src/app/interfaces/language';
import { AlertOptions } from 'src/app/interfaces/alert-options';
import { Store } from '@ngrx/store';
import * as fromStore from 'src/app/store/reducers';
import { authActions, userActions, tokenActions } from 'src/app/store/actions';
import { Error } from 'src/app/interfaces/error';
import { AppState } from 'src/app/store/reducers';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  public languageConfig: LanguageConfig = new LanguageConfig();
  public alertOptions: AlertOptions = <AlertOptions>{};
  public getAppLanguage$: Observable<Language>;
  private _user: User;
  private _appLanguage: Language;
  private _error: Error;
  private _subscriptions: Subscription[] = [];

  constructor(private _activateRoute: ActivatedRoute,
    private _router: Router,
    private _store: Store<AppState>
  ) {
    this.getAppLanguage$ = this._store.select(fromStore.getAppLanguage);
    this.form = new FormGroup({
      Email: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
      ]),
      Password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6)
      ])
    });
  }

  ngOnInit() {
    this.verifySocialLogin();
    this._subscriptions.push(
      this._store.select(fromStore.getUserInfo).subscribe(user => { this._user = user; }),
      this.getAppLanguage$.subscribe(appLanguage => { this._appLanguage = appLanguage; }),
      this._store.select(fromStore.getDecodeJwt).subscribe(decodedJwt => {
        if (decodedJwt.Oid) {
          this.form.reset();
        }
      }),
      this._store.select(fromStore.getAuthAlert, { actionType: authActions.LOCAL_LOGIN }).subscribe(alertOptions => {
        if (alertOptions) {
          this.alertOptions = alertOptions;
          switch (this.alertOptions.Code) {
            case 454:
              this._user.Email = this.form.value.Email;
              this._user.Password = this.form.value.Password;
              this._store.dispatch(new userActions.SetUser({ user: this._user }));
              this._router.navigate(['/twoFactorAuth']);
              break;

            case 460:
              // tslint:disable-next-line: max-line-length
              this._store.dispatch(new tokenActions.NewTokenByEmail({ actionId: 5, laguageId: this._appLanguage.Id, email: this.form.value.Email }));
              this._router.navigate(['/deviceConfirmation']);
              break;

            default:
              break;
          }
        }
      })
    );
  }

  ngOnDestroy() {
    if (this.alertOptions) {
      this._store.dispatch(new authActions.RemoveAuthAlert({ action: authActions.LOCAL_LOGIN }));
    }
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  async login() {
    this._store.dispatch(
      new authActions.LocalLogin({
        email: this.form.value.Email,
        password: this.form.value.Password,
        roleId: '1'
      })
    );
  }

  async verifySocialLogin() {
    let token: any = this._activateRoute.snapshot.queryParamMap.get('token');
    if (token) {
      token = token.search('Code') >= 0 ? JSON.parse(token) : token;
      if (typeof (token) !== 'object') {
        this._store.dispatch(new authActions.SetJwt({ jwt: token }));
      } else {
        const alertOption: AlertOptions = <AlertOptions>{};
        alertOption.Type = 'danger';
        alertOption.TextColor = 'dark';
        alertOption.Status = true;
        alertOption.Message = this.languageConfig[this._appLanguage.Code].backend.errors[token.Code];
        alertOption.CloseAction = new authActions.RemoveAuthAlert({ action: authActions.LOCAL_LOGIN });
        alertOption.ActionType = authActions.LOCAL_LOGIN;
        alertOption.Code = token.Code;
        this._store.dispatch(new authActions.AddAuthAlert({ alertOption }));
      }
    }
  }
}
