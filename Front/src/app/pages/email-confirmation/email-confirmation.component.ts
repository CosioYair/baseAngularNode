import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LanguageConfig } from 'src/app/language-config';
import { AlertOptions } from 'src/app/interfaces/alert-options';
import { Observable, Subscription } from 'rxjs';
import { Language } from 'src/app/interfaces/language';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import * as fromStore from 'src/app/store/reducers';
import { tokenActions } from 'src/app/store/actions';
import { Error } from 'src/app/interfaces/error';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.scss']
})
export class EmailConfirmationComponent implements OnInit, OnDestroy {

  private _token: string;
  public getEmailSendStatus$: Observable<Boolean>;
  public getValidTokenStatus$: Observable<Boolean>;
  public getConfirmedTokenStatus$: Observable<Boolean>;
  public languageConfig: LanguageConfig = new LanguageConfig();
  public alertOptions: AlertOptions = <AlertOptions>{};
  public getAppLanguage$: Observable<Language>;
  private _appLanguage: Language;
  private _error: Error;
  private _subscriptions: Subscription[] = [];

  constructor(private _activateRoute: ActivatedRoute,
    private _store: Store<AppState>
  ) {
    this.getAppLanguage$ = this._store.select(fromStore.getAppLanguage);
    this.getEmailSendStatus$ = this._store.select(fromStore.getEmailSendStatus);
    this.getValidTokenStatus$ = this._store.select(fromStore.getValidTokenStatus);
    this.getConfirmedTokenStatus$ = this._store.select(fromStore.getConfirmedTokenStatus);
  }

  ngOnInit() {
    this.validateToken();
    this._subscriptions.push(
      this.getAppLanguage$.subscribe(appLanguage => { this._appLanguage = appLanguage; }),
      this.getValidTokenStatus$.subscribe(validToken => {
        if (validToken) {
          this._store.dispatch(new tokenActions.ConfirmToken({ token: this._token }));
        }
      }),
      this._store.select(fromStore.getTokenActionsError).subscribe(error => {
        this._error = error;
        if (this._error) {
          this.alertOptions.Type = 'danger';
          this.alertOptions.TextColor = 'dark';
          this.alertOptions.Status = true;
          this.alertOptions.Message = this.languageConfig[this._appLanguage.Code].backend.errors[error.Code];
          this.alertOptions.CloseAction = new tokenActions.SetError({ error: null });
          this.alertOptions.Close = false;
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

  validateToken() {
    this._token = this._activateRoute.snapshot.queryParamMap.get('Token');
    this._token = this._token ? this._token : '';
    this._store.dispatch(new tokenActions.ValidateToken({ token: this._token }));
  }

  newActionToken() {
    this._store.dispatch(new tokenActions.NewTokenByOldToken({ token: this._token, laguageId: this._appLanguage.Id }));
  }
}
