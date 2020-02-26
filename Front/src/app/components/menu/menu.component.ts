import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import * as fromStore from 'src/app/store/reducers';
import * as auhtActions from 'src/app/store/actions/auth.actions';
import { LanguageConfig } from 'src/app/language-config';
import { Observable, Subscription } from 'rxjs';
import { Language } from 'src/app/interfaces/language';
import { User } from 'src/app/interfaces/user';
import { DecodedJwt } from 'src/app/interfaces/decoded-jwt';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  public userData: any;
  public activeLanguageIndex: number;
  public languageConfig: LanguageConfig = new LanguageConfig();
  public getAppLanguage$: Observable<Language>;
  public appLanguage: Language;
  public getLanguages$: Observable<Language[]>;
  public languages: Language[];
  public getUserInfo$: Observable<User>;
  public getDecodedJwt$: Observable<DecodedJwt>;
  public privileges: Array<string> = [];
  private _subscriptions: Subscription[] = [];

  constructor(private _store: Store<AppState>,
  ) {
    this.getLanguages$ = this._store.select(fromStore.getLanguages);
    this.getAppLanguage$ = this._store.select(fromStore.getAppLanguage);
    this.getUserInfo$ = this._store.select(fromStore.getUserInfo);
    this.getDecodedJwt$ = this._store.select(fromStore.getDecodeJwt);
  }

  ngOnInit() {
    this._subscriptions.push(
      this.getLanguages$.subscribe(languages => {
        this.languages = languages;
      }),
      this.getAppLanguage$.subscribe(appLanguage => {
        this.appLanguage = appLanguage;
      }),
      this.getDecodedJwt$.subscribe(decodedJwt => {
        this.privileges = decodedJwt.Privileges ? decodedJwt.Privileges.map(privilege => privilege.Code) : [];
      })
    );
    this.setActiveLanguageIndex();
  }

  setActiveLanguageIndex() {
    const languageIndex = this.languages.findIndex(language => language.Id === this.appLanguage.Id);
    this.activeLanguageIndex = languageIndex;
  }

  logout() {
    this._store.dispatch(new auhtActions.SetJwt({ jwt: null }));
  }

  setAppLanguage(language) {
    localStorage.setItem('appLanguage', JSON.stringify(language));
    location.reload();
  }

}
