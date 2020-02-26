import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private _authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot) {
    const noAuth = route.data.noAuth;
    return this._authService.isAuth(noAuth);
  }
}
