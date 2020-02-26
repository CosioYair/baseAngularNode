import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TokenActionsState } from '../reducers/token-actions.reducer';
import { ActionService } from 'src/app/services/action.service';
import * as tokenActions from '../actions/token-actions.actions';
import * as uiActions from 'src/app/store/actions/ui.actions';
import { map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class TokenActionsEffects {

    constructor(private _store: Store<TokenActionsState>,
        private _actions$: Actions,
        private _actionService: ActionService) { }

    @Effect()
    newTokenByEmail$ = this._actions$
        .pipe(
            ofType<tokenActions.NewTokenByEmail>(tokenActions.NEW_TOKEN_BY_EMAIL),
            map((action) => {
                this._store.dispatch(new uiActions.AddLoadingProcess({ process: tokenActions.NEW_TOKEN_BY_EMAIL }));
                return action;
            }),
            switchMap((action) =>
                this._actionService.newActionByUserEmail(action.payload.email, action.payload.laguageId, action.payload.actionId)
                    .pipe(
                        switchMap(() => {
                            return [
                                new tokenActions.SetEmailSendStatus({ status: true }),
                                new uiActions.RemoveLoadingProcess({ process: tokenActions.NEW_TOKEN_BY_EMAIL }),
                                new tokenActions.SetError({ error: null })
                            ];
                        }),
                        catchError(err => {
                            const error = err.error ? err.error : { Code: 399, Message: 'Something wrong' };
                            error.Type = tokenActions.NEW_TOKEN_BY_EMAIL;
                            return of(new tokenActions.SetError({ error }));
                        })
                    )),
        );

    @Effect()
    newTokenByOldToken$ = this._actions$
        .pipe(
            ofType<tokenActions.NewTokenByOldToken>(tokenActions.NEW_TOKEN_BY_OLD_TOKEN),
            map((action) => {
                this._store.dispatch(new uiActions.AddLoadingProcess({ process: tokenActions.NEW_TOKEN_BY_OLD_TOKEN }));
                return action;
            }),
            switchMap((action) =>
                // tslint:disable-next-line: max-line-length
                this._actionService.newActionByToken(action.payload.token, action.payload.laguageId, 'http://localhost:8080/emailConfirmation')
                    .pipe(
                        switchMap(() => {
                            return [
                                new tokenActions.SetEmailSendStatus({ status: true }),
                                new uiActions.RemoveLoadingProcess({ process: tokenActions.NEW_TOKEN_BY_OLD_TOKEN }),
                                new tokenActions.SetError({ error: null })
                            ];
                        }),
                        catchError(err => {
                            const error = err.error ? err.error : { Code: 399, Message: 'Something wrong' };
                            error.Type = tokenActions.NEW_TOKEN_BY_OLD_TOKEN;
                            return of(new tokenActions.SetError({ error }));
                        })
                    )),
        );

    @Effect()
    validateToken$ = this._actions$
        .pipe(
            ofType<tokenActions.ValidateToken>(tokenActions.VALIDATE_TOKEN),
            map((action) => {
                this._store.dispatch(new uiActions.AddLoadingProcess({ process: tokenActions.VALIDATE_TOKEN }));
                return action;
            }),
            switchMap((action) =>
                this._actionService.validateToken(action.payload.token)
                    .pipe(
                        switchMap((token: string) => {
                            return [
                                new tokenActions.SetValidTokenStatus({ status: true }),
                                new uiActions.RemoveLoadingProcess({ process: tokenActions.VALIDATE_TOKEN }),
                                new tokenActions.SetError({ error: null })
                            ];
                        }),
                        catchError(err => {
                            const error = err.error ? err.error : { Code: 399, Message: 'Something wrong' };
                            error.Type = tokenActions.VALIDATE_TOKEN;
                            return of(new tokenActions.SetError({ error }));
                        })
                    )),
        );

    @Effect()
    confirmToken$ = this._actions$
        .pipe(
            ofType<tokenActions.ConfirmToken>(tokenActions.CONFIRM_TOKEN),
            map((action) => {
                this._store.dispatch(new uiActions.AddLoadingProcess({ process: tokenActions.CONFIRM_TOKEN }));
                return action;
            }),
            switchMap((action) =>
                this._actionService.confirmToken(action.payload.token, action.payload.payload)
                    .pipe(
                        switchMap(() => {
                            return [
                                new tokenActions.SetConfirmedTokenStatus({ status: true }),
                                new uiActions.RemoveLoadingProcess({ process: tokenActions.CONFIRM_TOKEN }),
                                new tokenActions.SetError({ error: null })
                            ];
                        }),
                        catchError(err => {
                            const error = err.error ? err.error : { Code: 399, Message: 'Something wrong' };
                            error.Type = tokenActions.CONFIRM_TOKEN;
                            return of(new tokenActions.SetError({ error }));
                        })
                    )),
        );

    @Effect()
    setError$ = this._actions$
        .pipe(
            ofType<tokenActions.SetError>(tokenActions.SET_ERROR),
            map((action) => {
                const process = action.payload.error ? action.payload.error.Type : '';
                return new uiActions.RemoveLoadingProcess({ process });
            })
        );

}
