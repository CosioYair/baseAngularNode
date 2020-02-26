import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap, catchError } from 'rxjs/operators';
import * as appActions from '../actions';
import * as authActions from '../actions/auth.actions';
import * as fromStore from 'src/app/store/reducers';
import { uiActions } from '../actions';
import { userActions } from '../actions';
import { AuthService } from 'src/app/services/auth.service';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { LanguageConfig } from 'src/app/language-config';
import { Language } from 'src/app/interfaces/language';
import { AlertOptions } from 'src/app/interfaces/alert-options';


@Injectable()
export class AuthEffects {

    private _alertTypeDanger: string = 'danger';
    private _alertTypeSuccess: string = 'success';
    private _alertTextColor: string = 'dark';
    public languageConfig: LanguageConfig = new LanguageConfig();
    private _appLanguage: Language;

    constructor(private _store: Store<AppState>,
        private _actions$: Actions,
        private _authService: AuthService) {
        this._store.select(fromStore.getAppLanguage)
            .subscribe(appLanguage => {
                this._appLanguage = appLanguage;
            });
    }

    @Effect()
    localLogin$ = this._actions$
        .pipe(
            ofType<authActions.LocalLogin>(authActions.LOCAL_LOGIN),
            map((action) => {
                this._store.dispatch(new uiActions.AddLoadingProcess({ process: authActions.LOCAL_LOGIN }));
                return action;
            }),
            switchMap((action) =>
                this._authService.localLogin(action.payload.email,
                    action.payload.password,
                    action.payload.roleId,
                    action.payload.tfaId,
                    action.payload.tfaToken)
                    .pipe(
                        switchMap((jwt: string) => {
                            return [
                                new authActions.SetJwt({ jwt }),
                                new uiActions.RemoveLoadingProcess({ process: authActions.LOCAL_LOGIN })
                            ];
                        }),
                        catchError(err => {
                            const error = err.error ? err.error : { Code: 399, Message: 'Something wrong' };
                            const alertOption: AlertOptions = <AlertOptions>{};
                            alertOption.Type = this._alertTypeDanger;
                            alertOption.TextColor = this._alertTextColor;
                            alertOption.Status = true;
                            alertOption.Message = this.languageConfig[this._appLanguage.Code].backend.errors[error.Code];
                            alertOption.CloseAction = new authActions.RemoveAuthAlert({ action: authActions.LOCAL_LOGIN });
                            alertOption.ActionType = authActions.LOCAL_LOGIN;
                            alertOption.Code = error.Code;
                            return of(new authActions.AddAuthAlert({ alertOption }));
                        })
                    )),
        );

    @Effect()
    signupLogin$ = this._actions$
        .pipe(
            ofType<authActions.SignupLogin>(authActions.SIGNUP_LOGIN),
            map((action) => {
                this._store.dispatch(new uiActions.AddLoadingProcess({ process: authActions.SIGNUP_LOGIN }));
                return action;
            }),
            switchMap((action) =>
                this._authService.signup(action.payload.email,
                    action.payload.password,
                    action.payload.roleId)
                    .pipe(
                        switchMap(jwt => {
                            return [
                                new authActions.SetJwt({ jwt }),
                                new uiActions.RemoveLoadingProcess({ process: authActions.SIGNUP_LOGIN })
                            ];
                        }),
                        catchError(err => {
                            let error = err.error ? err.error : { Code: 399, Message: 'Something wrong' };
                            if (!error.Code) {
                                Object.keys(error).map(errorKey => {
                                    error = error[errorKey];
                                });
                            }
                            const alertOption: AlertOptions = <AlertOptions>{};
                            alertOption.Type = this._alertTypeDanger;
                            alertOption.TextColor = this._alertTextColor;
                            alertOption.Status = true;
                            alertOption.Message = this.languageConfig[this._appLanguage.Code].backend.errors[error.Code];
                            alertOption.CloseAction = new authActions.RemoveAuthAlert({ action: authActions.SIGNUP_LOGIN });
                            alertOption.ActionType = authActions.SIGNUP_LOGIN;
                            alertOption.Code = error.Code;
                            return of(new authActions.AddAuthAlert({ alertOption }));
                        })
                    )),
        );

    @Effect()
    setJwt$ = this._actions$
        .pipe(
            ofType<authActions.SetJwt>(authActions.SET_JWT),
            switchMap((action) => {
                const jwt = action.payload.jwt;
                const decodedJwt = this._authService.decodeJwt(jwt);
                const today = new Date();
                const expDate = decodedJwt.Exp ? new Date(decodedJwt.Exp) : new Date();
                const isAuth = today < expDate;
                const actions: any[] = [new authActions.SetDecodedJwt({ decodedJwt }), new authActions.SetIsAuth({ isAuth })];
                if (decodedJwt.Oid && isAuth) {
                    this._authService.login(jwt);
                    actions.push(new userActions.LoadUser({ oid: decodedJwt.Oid }));
                    actions.push(new userActions.LoadPendingProcesses({ userOid: decodedJwt.Oid }));
                } else {
                    actions.push(new appActions.Logout());
                }
                return actions;
            })
        );

    @Effect()
    addAuthAlert$ = this._actions$
        .pipe(
            ofType<authActions.AddAuthAlert>(authActions.ADD_AUTH_ALERT),
            map((action) => new uiActions.RemoveLoadingProcess({ process: action.payload.alertOption.ActionType }))
        );

}
