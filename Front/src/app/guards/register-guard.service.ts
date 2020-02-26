import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RegisterGuardService implements CanActivate {

  constructor(private _authService: AuthService) { 
  }

  canActivate() {    
    return this._authService.isRegisterCompleted();
  }
}
