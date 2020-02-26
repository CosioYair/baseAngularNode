import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Tfa } from 'src/app/interfaces/tfa';
import { Store } from '@ngrx/store';
import { tfaActions } from '../store/actions';
import * as fromComponets from '../store/reducers';
import * as fromStore from 'src/app/store/reducers';
import { LanguageConfig } from 'src/app/language-config';
import { Observable, Subscription } from 'rxjs';
import { Language } from 'src/app/interfaces/language';

@Component({
  selector: 'app-two-factor-auth-manager',
  templateUrl: './two-factor-auth-manager.component.html',
  styleUrls: ['./two-factor-auth-manager.component.scss']
})
export class TwoFactorAuthManagerComponent implements OnInit, OnDestroy {

  public userData: any;
  public form: FormGroup;
  public tfas: Tfa[] = [];
  public languageConfig: LanguageConfig = new LanguageConfig();
  public getAppLanguage$: Observable<Language>;
  public getTfas$: Observable<Tfa[]>;
  private _tfas: Tfa[];
  private _subscriptions: Subscription[] = [];

  constructor(private _store: Store<fromComponets.AppState>,
  ) {
    this.getAppLanguage$ = this._store.select(fromStore.getAppLanguage);
    this.getTfas$ = this._store.select(fromComponets.getTfas);
  }

  ngOnInit() {
    this._subscriptions.push(
      this.getTfas$.subscribe(tfas => { this._tfas = tfas; }),
    );
    if (this._tfas.length === 0) {
      this.getTfas();
    }
  }

  ngOnDestroy() {
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  getTfas() {
    this._store.dispatch(new tfaActions.LoadTfas());
  }

  async toogleTfa(tfa: Tfa) {
    if (!tfa.Active) {
      this._store.dispatch(new tfaActions.EnableTfa({ id: tfa.Id }));
    } else {
      this._store.dispatch(new tfaActions.DisableTfa({ id: tfa.Id }));
    }
  }
}
