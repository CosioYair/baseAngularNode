import { Component, OnInit, OnDestroy } from '@angular/core';
import { LanguageConfig } from 'src/app/language-config';
import { CookieService } from 'ngx-cookie-service';
import { AlertOptions } from 'src/app/interfaces/alert-options';
import { Observable, Subscription } from 'rxjs';
import { Language } from 'src/app/interfaces/language';
import { Error } from 'src/app/interfaces/error';
import { AppState } from 'src/app/store/reducers';
import { Store } from '@ngrx/store';
import * as fromStore from 'src/app/store/reducers';
import { tokenActions } from 'src/app/store/actions';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-device-confirmation',
  templateUrl: './device-confirmation.component.html',
  styleUrls: ['./device-confirmation.component.scss']
})
export class DeviceConfirmationComponent implements OnInit, OnDestroy {
  public languageConfig: LanguageConfig = new LanguageConfig();
  public alertOptions: AlertOptions = <AlertOptions>{};
  public getAppLanguage$: Observable<Language>;
  public getConfirmedTokenStatus$: Observable<Boolean>;
  private _appLanguage: Language;
  private _error: Error;
  private _subscriptions: Subscription[] = [];
  public form: FormGroup;

  constructor(private _cookieService: CookieService,
    private _store: Store<AppState>
  ) {
    this.getAppLanguage$ = this._store.select(fromStore.getAppLanguage);
    this.getConfirmedTokenStatus$ = this._store.select(fromStore.getConfirmedTokenStatus);
    this.form = new FormGroup({
      Token: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ]),
    });
  }

  ngOnInit() {
    this._subscriptions.push(
      this.getAppLanguage$.subscribe(appLanguage => { this._appLanguage = appLanguage; }),
      this._store.select(fromStore.getTokenActionsError).subscribe(error => {
        this._error = error;
        if (this._error) {
          this.alertOptions.Type = 'danger';
          this.alertOptions.TextColor = 'dark';
          this.alertOptions.Status = true;
          this.alertOptions.Message = this.languageConfig[this._appLanguage.Code].backend.errors[error.Code];
          this.alertOptions.CloseAction = new tokenActions.SetError({ error: null });
        } else {
          this.alertOptions = <AlertOptions>{};
        }
      })
    );
  }

  ngOnDestroy() {
    if (this._error) {
      this._store.dispatch(new tokenActions.SetError({ error: null }));
    }
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  confirmToken() {
    this._store.dispatch(new tokenActions.ConfirmToken({
      token: this.form.value.Token
    }));
  }
}
