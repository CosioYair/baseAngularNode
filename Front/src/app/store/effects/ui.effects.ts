import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap, catchError } from 'rxjs/operators';
import * as uiActions from '../actions/ui.actions';
import * as fromStore from 'src/app/store/reducers';
import { of } from 'rxjs';
import { LanguageService } from 'src/app/services/language.service';
import { Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { Language } from 'src/app/interfaces/language';
import { AlertOptions } from 'src/app/interfaces/alert-options';
import { LanguageConfig } from 'src/app/language-config';


@Injectable()
export class UiEffects {

    private _alertTypeDanger: string = 'danger';
    private _alertTypeSuccess: string = 'success';
    private _alertTextColor: string = 'dark';
    public languageConfig: LanguageConfig = new LanguageConfig();
    private _appLanguage: Language;

    constructor(private _store: Store<AppState>,
        private _actions$: Actions,
        private _languageService: LanguageService) {
        this._store.select(fromStore.getAppLanguage)
            .subscribe(appLanguage => {
                this._appLanguage = appLanguage;
            });
    }

    @Effect()
    loadLanguages$ = this._actions$
        .pipe(
            ofType(uiActions.LOAD_LANGUAGES),
            map(() => {
                this._store.dispatch(new uiActions.AddLoadingProcess({ process: uiActions.LOAD_LANGUAGES }));
            }),
            switchMap(() => this._languageService.getLanguages()
                .pipe(
                    switchMap((languages: Language[]) => {
                        this._languageService.setStoreLanguages(languages);
                        return [
                            new uiActions.SetLanguages({ languages }),
                            new uiActions.RemoveLoadingProcess({ process: uiActions.LOAD_LANGUAGES })
                        ];
                    }),
                    catchError(err => {
                        const error = err.error ? err.error : { Code: 399, Message: 'Something wrong' };
                        const alertOption: AlertOptions = <AlertOptions>{};
                        alertOption.Type = this._alertTypeDanger;
                        alertOption.TextColor = this._alertTextColor;
                        alertOption.Status = true;
                        alertOption.Message = this.languageConfig[this._appLanguage.Code].backend.errors[error.Code];
                        alertOption.CloseAction = new uiActions.RemoveUiAlert({ action: uiActions.LOAD_LANGUAGES });
                        alertOption.ActionType = uiActions.LOAD_LANGUAGES;
                        return of(new uiActions.AddUiAlert({ alertOption }));
                    })
                )),
        );

    @Effect()
    addUiAlert$ = this._actions$
        .pipe(
            ofType<uiActions.AddUiAlert>(uiActions.ADD_UI_ALERT),
            map((action) => new uiActions.RemoveLoadingProcess({ process: action.payload.alertOption.ActionType }))
        );
}
