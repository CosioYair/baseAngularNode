import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { matchValidator } from 'src/app/validators/match-validator';
import { LanguageConfig } from 'src/app/language-config';
import { AlertOptions } from 'src/app/interfaces/alert-options';
import { Language } from 'src/app/interfaces/language';
import { Observable, Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import * as fromStore from 'src/app/store/reducers';
import { authActions } from 'src/app/store/actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  public icosTerms: boolean;
  public languageConfig: LanguageConfig = new LanguageConfig();
  public alertOptions: AlertOptions;
  public getAppLanguage$: Observable<Language>;
  public appLanguage: Language;
  private _error: any;
  private _subscriptions: Subscription[] = [];

  constructor(private _store: Store<AppState>
  ) {
    this.alertOptions = <AlertOptions>{};
    this.getAppLanguage$ = this._store.select(fromStore.getAppLanguage);
    this.form = new FormGroup({
      Email: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
      ]),
      Password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6)
      ]),
      PasswordConfirm: new FormControl(null, [
        Validators.required,
        matchValidator('Password')
      ]),
      icosTerms: new FormControl(this.icosTerms, [
        Validators.requiredTrue
      ]),
      captcha: new FormControl(null, Validators.required),
    });
  }

  ngOnInit() {
    this._subscriptions.push(
      this.getAppLanguage$.subscribe(appLanguage => { this.appLanguage = appLanguage; }),
      this._store.select(fromStore.getDecodeJwt).subscribe(decodedJwt => {
        if (decodedJwt.Oid) {
          this.form.reset();
        }
      }),
      this._store.select(fromStore.getAuthAlert, { actionType: authActions.SIGNUP_LOGIN }).subscribe(alertOptions => {
        if (alertOptions) {
          this.alertOptions = alertOptions;
        }
      })
    );
  }

  ngOnDestroy() {
    if (this.alertOptions) {
      this._store.dispatch(new authActions.RemoveAuthAlert({ action: authActions.SIGNUP_LOGIN }));
    }
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  async singup() {
    this._store.dispatch(new authActions.SignupLogin({
      email: this.form.value.Email,
      password: this.form.value.Password,
      roleId: '1'
    }));
  }
}
