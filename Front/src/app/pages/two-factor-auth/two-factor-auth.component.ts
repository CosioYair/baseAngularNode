import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { AlertOptions } from 'src/app/interfaces/alert-options';
import { Tfa } from 'src/app/interfaces/tfa';
import { LanguageConfig } from 'src/app/language-config';
import { Language } from 'src/app/interfaces/language';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromTfa from './store/reducers';
import * as fromStore from 'src/app/store/reducers';
import { authActions } from 'src/app/store/actions';
import { activeTfasActions } from './store/actions';
import { User } from 'src/app/interfaces/user';
import { DecodedJwt } from 'src/app/interfaces/decoded-jwt';
import { Error } from 'src/app/interfaces/error';
import { Router } from '@angular/router';

@Component({
  selector: 'app-two-factor-auth',
  templateUrl: './two-factor-auth.component.html',
  styleUrls: ['./two-factor-auth.component.scss']
})
export class TwoFactorAuthComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  public alertOptionsEmail: AlertOptions = <AlertOptions>{};
  public alertOptionsToken: AlertOptions = <AlertOptions>{};
  public getActiveTfas$: Observable<Tfa[]>;
  private _activeTfas: Tfa[] = [];
  public languageConfig: LanguageConfig = new LanguageConfig();
  public getAppLanguage$: Observable<Language>;
  private _appLanguage: Language;
  private _user: User;
  private _decodedJwt: DecodedJwt;
  private _error: Error;
  private _subscriptions: Subscription[] = [];

  constructor(private _store: Store<fromTfa.AppState>,
    private _authService: AuthService,
    private _router: Router,
  ) {
    this.getAppLanguage$ = this._store.select(fromStore.getAppLanguage);
    this.getActiveTfas$ = this._store.select(fromTfa.getActiveTfas);
    this.form = new FormGroup({
      tfaToken: new FormControl(null, [
        Validators.required,
        Validators.minLength(6)
      ]),
      tfaId: new FormControl(null, [
        Validators.required,
      ])
    });
  }

  ngOnInit() {
    this._subscriptions.push(
      this.getAppLanguage$.subscribe(appLanguage => { this._appLanguage = appLanguage; }),
      this.getActiveTfas$.subscribe(activeTfas => { this._activeTfas = activeTfas; }),
      this._store.select(fromStore.getUserInfo).subscribe(user => { this._user = user; }),
      this._store.select(fromStore.getAuthAlert, { actionType: authActions.LOCAL_LOGIN }).subscribe(alertOptions => {
        if (alertOptions) {
          this.alertOptionsToken = alertOptions;
        }
      })
    );
    if (this._activeTfas.length === 0) {
      this.getActiveTfas();
    }
  }

  ngOnDestroy() {
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  getActiveTfas() {
    if (this._user.Email) {
      this._store.dispatch(new activeTfasActions.LoadActiveTfas({ email: this._user.Email }));
    } else {
      this._router.navigate(['/auth']);
    }
  }

  setTfaId(tfaId) {
    this.form.controls['tfaId'].setValue(tfaId);
  }

  async generateLocalTfaToken() {
    // tslint:disable-next-line: max-line-length
    await this._authService.generateLocalTfaToken(this._user.Email, this.languageConfig[this._appLanguage.Code].common.tfaTokenVerification, this.languageConfig[this._appLanguage.Code].common.provideToken)
      .then(response => {
        this.alertOptionsEmail.Type = 'success';
        this.alertOptionsEmail.Status = true;
        this.alertOptionsEmail.Message = this.languageConfig[this._appLanguage.Code].common.tokenEmailSent;
      }).catch(err => {
        const errorCode = err.error ? err.error.Code : 399;
        this.alertOptionsEmail.Type = 'danger';
        this.alertOptionsEmail.Status = true;
        this.alertOptionsEmail.Message = this.languageConfig[this._appLanguage.Code].backend.errors[errorCode];
      });
  }

  async login() {
    const tfaToken = this.form.value.tfaToken;
    const tfaId = this.form.value.tfaId;
    this._store.dispatch(new authActions.LocalLogin({
      email: this._user.Email,
      password: this._user.Password,
      roleId: '1',
      tfaId,
      tfaToken
    }));
  }
}
