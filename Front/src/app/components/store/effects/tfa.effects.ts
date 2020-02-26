import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TfaState } from '../reducers/tfa.reducer';
import * as tfaActions from '../actions/tfa.actions';
import * as uiActions from 'src/app/store/actions/ui.actions';
import { map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { Tfa } from 'src/app/interfaces/tfa';

@Injectable()
export class TfaEffects {

    constructor(private _store: Store<TfaState>,
        private _actions$: Actions,
        private _userService: UserService) { }

    @Effect()
    loadTfas$ = this._actions$
        .pipe(
            ofType<tfaActions.LoadTfas>(tfaActions.LOAD_TFAS),
            map((action) => {
                this._store.dispatch(new uiActions.AddLoadingProcess({ process: tfaActions.LOAD_TFAS }));
                return action;
            }),
            switchMap((action) =>
                this._userService.tfas()
                    .pipe(
                        switchMap((tfas: Tfa[]) => {
                            return [
                                new tfaActions.SetTfas({ tfas }),
                                new uiActions.RemoveLoadingProcess({ process: tfaActions.LOAD_TFAS })
                            ];
                        }),
                        catchError(err => {
                            const error = err.error ? err.error : { Code: 399, Message: 'Something wrong' };
                            error.Type = tfaActions.LOAD_TFAS;
                            return of(new tfaActions.SetError({ error }));
                        })
                    )),
        );

    @Effect()
    enableTfa$ = this._actions$
        .pipe(
            ofType<tfaActions.EnableTfa>(tfaActions.ENABLE_TFA),
            map((action) => {
                this._store.dispatch(new uiActions.AddLoadingProcess({ process: tfaActions.ENABLE_TFA }));
                return action;
            }),
            switchMap((action) =>
                this._userService.enableTfa(action.payload.id)
                    .pipe(
                        switchMap((tfa: Tfa) => {
                            return [
                                new tfaActions.SetTfaStatus({ id: action.payload.id, status: tfa.Active }),
                                new uiActions.RemoveLoadingProcess({ process: tfaActions.ENABLE_TFA })
                            ];
                        }),
                        catchError(err => {
                            const error = err.error ? err.error : { Code: 399, Message: 'Something wrong' };
                            error.Type = tfaActions.ENABLE_TFA;
                            return of(new tfaActions.SetError({ error }));
                        })
                    )),
        );

    @Effect()
    disableTfa$ = this._actions$
        .pipe(
            ofType<tfaActions.DisableTfa>(tfaActions.DISABLE_TFA),
            map((action) => {
                this._store.dispatch(new uiActions.AddLoadingProcess({ process: tfaActions.DISABLE_TFA }));
                return action;
            }),
            switchMap((action) =>
                this._userService.disableTfa(action.payload.id)
                    .pipe(
                        switchMap((tfa: Tfa) => {
                            return [
                                new tfaActions.SetTfaStatus({ id: action.payload.id, status: tfa.Active }),
                                new uiActions.RemoveLoadingProcess({ process: tfaActions.DISABLE_TFA })
                            ];
                        }),
                        catchError(err => {
                            const error = err.error ? err.error : { Code: 399, Message: 'Something wrong' };
                            error.Type = tfaActions.DISABLE_TFA;
                            return of(new tfaActions.SetError({ error }));
                        })
                    )),
        );

    @Effect()
    setError$ = this._actions$
        .pipe(
            ofType<tfaActions.SetError>(tfaActions.SET_ERROR),
            map((action) => new uiActions.RemoveLoadingProcess({ process: action.payload.error.Type }))
        );

}
