import { Component, OnInit } from '@angular/core';
import { LanguageConfig } from 'src/app/language-config';
import { Observable } from 'rxjs';
import { Language } from 'src/app/interfaces/language';
import { Store } from '@ngrx/store';
import * as fromStore from 'src/app/store/reducers';
import { AppState } from 'src/app/store/reducers';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public languageConfig: LanguageConfig = new LanguageConfig();
  public getAppLanguage$: Observable<Language>;

  constructor(private _store: Store<AppState>) {
    this.getAppLanguage$ = this._store.select(fromStore.getAppLanguage);
  }

  ngOnInit() {
  }

}
