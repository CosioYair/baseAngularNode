import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import * as appActions from '../actions';
import { AuthService } from 'src/app/services/auth.service';

import { AuthEffects } from './auth.effects';
import { UiEffects } from './ui.effects';
import { UserEffects } from './user.effects';
import { TokenActionsEffects } from './token-actions.effects';
import { LanguageService } from 'src/app/services/language.service';
import { uiActions } from '../actions';
import { Language } from 'src/app/interfaces/language';

@Injectable()
export class AppEffects {

    constructor(
        private _actions$: Actions,
        private _authService: AuthService,
        private _langaugeService: LanguageService) { }

    @Effect()
    logout$ = this._actions$
        .pipe(
            ofType<appActions.Logout>(appActions.LOGOUT),
            switchMap((action) => {
                return this._langaugeService.getStoreLanguages()
                    .pipe(
                        map((languages: Language[]) => {
                            this._authService.logout();
                            return new uiActions.SetLanguages({ languages });
                        })
                    );
            })
        );
}

export const effects: any = [
    AppEffects,
    AuthEffects,
    UiEffects,
    UserEffects,
    TokenActionsEffects
];

export * from './auth.effects';
export * from './ui.effects';
export * from './user.effects';
export * from './token-actions.effects';

