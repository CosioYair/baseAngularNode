import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LanguageConfig } from 'src/app/language-config';
import { UserService } from 'src/app/services/user.service';
import { AlertOptions } from 'src/app/interfaces/alert-options';
import { Observable, Subscription } from 'rxjs';
import { Language } from 'src/app/interfaces/language';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import * as fromStore from 'src/app/store/reducers';
import { User } from 'src/app/interfaces/user';
import { userActions } from 'src/app/store/actions';

@Component({
  selector: 'app-createadmin',
  templateUrl: './createadmin.component.html',
  styleUrls: ['./createadmin.component.scss']
})
export class CreateadminComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public languageConfig: LanguageConfig = new LanguageConfig();
  public alertOptions: AlertOptions = <AlertOptions>{};
  public getAppLanguage$: Observable<Language>;
  public getConfirmedTokenStatus$: Observable<Boolean>;
  private _appLanguage: Language;
  private _error: Error;
  private _subscriptions: Subscription[] = [];

  constructor(private _userService: UserService,
    private _store: Store<AppState>) {
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
    this._subscriptions.push(
      this.getAppLanguage$.subscribe(appLanguage => { this._appLanguage = appLanguage; }),
      this._store.select(fromStore.getUserAlert, { actionType: userActions.CREATE_USER }).subscribe((alert: AlertOptions) => {
        if (alert) {
          this.alertOptions = alert;
          if (alert.Type === 'success') {
            this.form.reset();
          }
        }
      })
    );
  }

  ngOnDestroy() {
    if (this.alertOptions) {
      this._store.dispatch(new userActions.RemoveUserAlert({ action: userActions.CREATE_USER }));
    }
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  async createAdmin() {
    const user = <User>{
      ...<User>{},
      Email: this.form.value.Email,
      Password: this.form.value.Password,
      IdentityConfirmed: true,
      EmailConfirmed: true
    };
    this._store.dispatch(new userActions.CreateUser({
      user,
      roleId: 2,
      registerTypeId: 1,
      confirmUrl: 'http://localhost:8080/emailConfirmation'
    }));
  }
}
