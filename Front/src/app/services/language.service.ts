import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { AppState } from '../store/reducers';
import * as fromStore from 'src/app/store/reducers';
import { uiActions } from '../store/actions';
import { Language } from '../interfaces/language';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor(private _http: HttpClient,
    private _store: Store<AppState>,
  ) {
    this.setAppLanguage();
    this.loadLanguages();
  }

  private setAppLanguage() {
      const appLanguage = JSON.parse(localStorage.getItem('appLanguage'));
      this._store.select(fromStore.getAppLanguage).subscribe(storeAppLanguage => {
        if (appLanguage == null) {
          localStorage.setItem('appLanguage', JSON.stringify(storeAppLanguage));
        } else {
          if (appLanguage.Id !== storeAppLanguage.Id) {
            this._store.dispatch(new uiActions.SetAppLanguage({ language: appLanguage }));
          }
        }
      });
  }

  public loadLanguages() {
    setTimeout(() => {
      this._store.dispatch(new uiActions.LoadLanguages());
    }, 1000);
  }

  getLanguages() {
    return this._http.get(`http://localhost:3000/api/languages`)
      .pipe(
        map(response => response['languages'])
      );
  }

  setStoreLanguages(languages: Language[]) {
    return localStorage.setItem('languages', JSON.stringify(languages));
  }

  getStoreLanguages(): Observable<Language[]> {
    return from([JSON.parse(localStorage.getItem('languages'))]);
  }

  getCurrentLanguage () {
    return {};
  }
}
