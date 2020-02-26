import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserfiletypeService } from 'src/app/services/userfiletype.service';
import { UserService } from 'src/app/services/user.service';
import { Location, PlatformLocation } from '@angular/common';
import { UserFileType } from 'src/app/interfaces/user-file-type';
import { User } from 'src/app/interfaces/User';
import { LanguageConfig } from 'src/app/language-config';
import { MailService } from 'src/app/services/mail.service';
import { Language } from 'src/app/interfaces/language';
import { Observable, Subscription } from 'rxjs';
import { AppState } from 'src/app/store/reducers';
import { Store } from '@ngrx/store';
import * as fromStore from 'src/app/store/reducers';
import { userActions } from 'src/app/store/actions';
import { AlertOptions } from 'src/app/interfaces/alert-options';


@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit, OnDestroy {
  public userFileTypes: UserFileType[];
  public userOid: any;
  public userEmail: any;
  public getUnconfirmedUsers$: Observable<User[]>;
  private _unconfirmedUsers: User[];
  public getAppLanguage$: Observable<Language>;
  public appLanguage: Language;
  public languageConfig: LanguageConfig = new LanguageConfig();
  private _updateAlert: AlertOptions = <AlertOptions>{};
  public labelOptions: any;
  public messages: any;
  private _subscriptions: Subscription[] = [];

  constructor(private _userFileTypeService: UserfiletypeService,
    private _userService: UserService,
    public location: Location,
    public platformLocation: PlatformLocation,
    private _mailService: MailService,
    private _store: Store<AppState>) {
    this.getAppLanguage$ = this._store.select(fromStore.getAppLanguage);
    this.getUnconfirmedUsers$ = this._store.select(fromStore.getUnconfirmedUsers);
    this.labelOptions = ['idfront', 'idback', 'proof'];
    this.messages = [];
  }

  ngOnInit() {
    this._subscriptions.push(
      this.getAppLanguage$.subscribe(appLanguage => { this.appLanguage = appLanguage; }),
      this.getUnconfirmedUsers$.subscribe(unconfirmedUsers => { this._unconfirmedUsers = unconfirmedUsers; }),
      this._store.select(fromStore.getAuthAlert, { actionType: userActions.UPDATE_USER }).subscribe(updateAlert => {
        this._updateAlert = updateAlert;
        if (updateAlert.Type === 'success') {
          this.getUnconfirmedUsers();
        }
      }),
    );
    if (this._unconfirmedUsers.length === 0) {
      this.getUnconfirmedUsers();
    }
  }

  ngOnDestroy() {
    if (this._updateAlert) {
      this._store.dispatch(new userActions.RemoveUserAlert({ action: userActions.UPDATE_USER }));
    }
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  getFilesByUser(oid, email) {
    this._userFileTypeService.getByUser(oid)
      .then(response => {
        this.userFileTypes = response['userfiletypes'];
      });
    this.userOid = oid;
    this.userEmail = email;
    document.getElementById('decline').style.display = 'none';
    document.getElementById('confirm').style.display = 'block';
    this.messages = [];
  }

  getUnconfirmedUsers() {
    this._store.dispatch(new userActions.LoadUncofirmedUsers());
  }

  updateUser() {
    const user = this._unconfirmedUsers.find(unconfirmedUser => unconfirmedUser.Oid === this.userOid);
    user.IdentityConfirmed = true;
    this._store.dispatch(new userActions.UpdateUser({
      oid: user.Oid,
      user
    }));
    this._userService.update(this.userOid, user).toPromise().then(res => {
      this.getUnconfirmedUsers();
    });
  }

  async declineFiles() {
    let documentList = '';
    this.messages.map(message => {
      documentList += message + '\n';
    });
    // tslint:disable-next-line: max-line-length
    await this._mailService.postMail(this.userEmail, this.languageConfig[this.appLanguage.Code].errors.declineDocuments, `${this.languageConfig[this.appLanguage.Code].errors.declineDocumentsList}\n\n ${documentList}`);
  }

  updateBoxes(e, text) {
    const index = this.messages.findIndex(message => message === text);
    e.target.checked ? this.messages.push(text) : this.messages.splice(index, 1);
    if (this.messages.length > 0) {
      document.getElementById('decline').style.display = 'block';
      document.getElementById('confirm').style.display = 'none';
    } else {
      document.getElementById('decline').style.display = 'none';
      document.getElementById('confirm').style.display = 'block';
    }
  }
}
