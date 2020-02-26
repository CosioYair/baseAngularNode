import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ActiveTfasState } from '../reducers/active-tfas.reducer';
import * as activeTfasActions from '../actions/active-tfas.actions';
import * as uiActions from 'src/app/store/actions/ui.actions';
import { map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { Tfa } from 'src/app/interfaces/tfa';

@Injectable()
export class ActiveTfasEffects {

    constructor(private _store: Store<ActiveTfasState>,
        private _actions$: Actions,
        private _userService: UserService) { }

    @Effect()
    loadActiveTfas$ = this._actions$
        .pipe(
            ofType<activeTfasActions.LoadActiveTfas>(activeTfasActions.LOAD_ACTIVE_TFAS),
            map((action) => {
                this._store.dispatch(new uiActions.AddLoadingProcess({ process: activeTfasActions.LOAD_ACTIVE_TFAS }));
                return action;
            }),
            switchMap((action) =>
                this._userService.activeTfas(action.payload.email)
                    .pipe(
                        switchMap((activeTfas: Tfa[]) => {
                            return [
                                new activeTfasActions.SetActiveTfas({ activeTfas }),
                                new uiActions.RemoveLoadingProcess({ process: activeTfasActions.LOAD_ACTIVE_TFAS })
                            ];
                        }),
                        catchError(err => {
                            const error = err.error ? err.error : { Code: 399, Message: 'Something wrong' };
                            return of(new activeTfasActions.SetError({ error }));
                        })
                    )),
        );

    @Effect()
    setError$ = this._actions$
        .pipe(
            ofType<activeTfasActions.SetError>(activeTfasActions.SET_ERROR),
            map((action) => new uiActions.RemoveLoadingProcess({ process: activeTfasActions.LOAD_ACTIVE_TFAS }))
        );

}
