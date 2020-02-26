import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap, catchError } from 'rxjs/operators';
import * as userActions from '../actions/user.actions';
import * as uiActions from '../actions/ui.actions';
import { of } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { TypeError } from 'src/app/interfaces/type-error';
import { User } from 'src/app/interfaces/user';
import { PendingProcesses } from 'src/app/interfaces/pending-processes';
import { ActiveProcessGroupService } from 'src/app/services/active-process-group.service';
import { Process } from 'src/app/interfaces/process';
import { AlertOptions } from 'src/app/interfaces/alert-options';
import { Error } from 'src/app/interfaces/error';
import * as fromStore from 'src/app/store/reducers';
import { Language } from 'src/app/interfaces/language';
import { LanguageConfig } from 'src/app/language-config';


@Injectable()
export class UserEffects {

    private _alertTypeDanger: string = 'danger';
    private _alertTypeSuccess: string = 'success';
    private _alertTextColor: string = 'dark';
    public languageConfig: LanguageConfig = new LanguageConfig();
    private _appLanguage: Language;

    constructor(private _store: Store<AppState>,
        private _actions$: Actions,
        private _userService: UserService,
        private _activeProcessGroupService: ActiveProcessGroupService, ) {
        this._store.select(fromStore.getAppLanguage)
            .subscribe(appLanguage => {
                this._appLanguage = appLanguage;
            });
    }

    @Effect()
    loadUser$ = this._actions$
        .pipe(
            ofType<userActions.LoadUser>(userActions.LOAD_USER),
            map((action) => {
                this._store.dispatch(new uiActions.AddLoadingProcess({ process: userActions.LOAD_USER }));
                return action;
            }),
            switchMap((action) => this._userService.show(action.payload.oid)
                .pipe(
                    switchMap((user: User) => {
                        return [
                            new userActions.SetUser({ user }),
                            new uiActions.RemoveLoadingProcess({ process: userActions.LOAD_USER }),
                        ];
                    }),
                    catchError(err => {
                        const error: Error = err.error ? err.error : { Code: 399, Message: 'Something wrong' };
                        const alertOption: AlertOptions = <AlertOptions>{};
                        alertOption.Type = this._alertTypeDanger;
                        alertOption.TextColor = this._alertTextColor;
                        alertOption.Status = true;
                        alertOption.Message = this.languageConfig[this._appLanguage.Code].backend.errors[error.Code];
                        alertOption.CloseAction = new userActions.RemoveUserAlert({ action: userActions.LOAD_USER });
                        alertOption.ActionType = userActions.LOAD_USER;
                        return of(new userActions.AddUserAlert({ alertOption }));
                    })
                )),
        );

    @Effect()
    updateUser$ = this._actions$
        .pipe(
            ofType<userActions.UpdateUser>(userActions.UPDATE_USER),
            map((action) => {
                this._store.dispatch(new uiActions.AddLoadingProcess({ process: userActions.UPDATE_USER }));
                return action;
            }),
            switchMap((action) => this._userService.update(action.payload.oid, action.payload.user)
                .pipe(
                    switchMap((user: User) => {
                        const actions: any[] = [
                            new userActions.SetUser({ user }),
                            new uiActions.RemoveLoadingProcess({ process: userActions.UPDATE_USER }),
                        ];
                        if (action.payload.finishedProcessOid) {
                            actions.push(new userActions.FinishPendingProcess({
                                oid: action.payload.finishedProcessOid,
                                userOid: user.Oid
                            }));
                        }
                        const alertOption: AlertOptions = <AlertOptions>{};
                        alertOption.Type = this._alertTypeSuccess;
                        alertOption.TextColor = this._alertTextColor;
                        alertOption.Status = true;
                        alertOption.Message = this.languageConfig[this._appLanguage.Code].common.success;
                        alertOption.CloseAction = new userActions.RemoveUserAlert({ action: userActions.UPDATE_USER });
                        alertOption.ActionType = userActions.UPDATE_USER;
                        return actions;
                    }),
                    catchError(err => {
                        const error: TypeError = err.error ? err.error : { Code: 399, Message: 'Something wrong' };
                        const alertOption: AlertOptions = <AlertOptions>{};
                        alertOption.Type = this._alertTypeDanger;
                        alertOption.TextColor = this._alertTextColor;
                        alertOption.Status = true;
                        alertOption.Message = this.languageConfig[this._appLanguage.Code].backend.errors[error.Code];
                        alertOption.CloseAction = new userActions.RemoveUserAlert({ action: userActions.UPDATE_USER });
                        alertOption.ActionType = userActions.UPDATE_USER;
                        return of(new userActions.AddUserAlert({ alertOption }));
                    })
                )),
        );

    @Effect()
    createUser$ = this._actions$
        .pipe(
            ofType<userActions.CreateUser>(userActions.CREATE_USER),
            map((action) => {
                this._store.dispatch(new uiActions.AddLoadingProcess({ process: userActions.CREATE_USER }));
                return action;
            }),
            // tslint:disable-next-line: max-line-length
            switchMap((action) => this._userService.create(action.payload.user, action.payload.roleId, action.payload.registerTypeId, action.payload.confirmUrl)
                .pipe(
                    switchMap((user: User) => {
                        const alertOption: AlertOptions = <AlertOptions>{};
                        alertOption.Type = this._alertTypeSuccess;
                        alertOption.TextColor = this._alertTextColor;
                        alertOption.Status = true;
                        alertOption.Message = this.languageConfig[this._appLanguage.Code].common.success;
                        alertOption.CloseAction = new userActions.RemoveUserAlert({ action: userActions.CREATE_USER });
                        alertOption.ActionType = userActions.CREATE_USER;
                        return [
                            new uiActions.RemoveLoadingProcess({ process: userActions.CREATE_USER }),
                            new userActions.AddUserAlert({ alertOption })
                        ];
                    }),
                    catchError(err => {
                        let error: TypeError = err.error ? err.error : { Code: 399, Message: 'Something wrong' };
                        const alertOption: AlertOptions = <AlertOptions>{};
                        if (!error.Code) {
                            Object.keys(error).map(errorKey => {
                                error = error[errorKey];
                            });
                        }
                        alertOption.Type = this._alertTypeDanger;
                        alertOption.TextColor = this._alertTextColor;
                        alertOption.Status = true;
                        alertOption.Message = this.languageConfig[this._appLanguage.Code].backend.errors[error.Code];
                        alertOption.CloseAction = new userActions.RemoveUserAlert({ action: userActions.CREATE_USER });
                        alertOption.ActionType = userActions.CREATE_USER;
                        return of(new userActions.AddUserAlert({ alertOption }));
                    })
                )),
        );

    @Effect()
    finishPendingProcess$ = this._actions$
        .pipe(
            ofType<userActions.FinishPendingProcess>(userActions.FINISH_PENDING_PROCESS),
            map((action) => {
                this._store.dispatch(new uiActions.AddLoadingProcess({ process: userActions.FINISH_PENDING_PROCESS }));
                return action;
            }),
            switchMap((action) => this._activeProcessGroupService.finishProcess(action.payload.oid)
                .pipe(
                    switchMap((process: Process) => {
                        return [
                            new userActions.LoadPendingProcesses({ userOid: action.payload.userOid }),
                            new uiActions.RemoveLoadingProcess({ process: userActions.FINISH_PENDING_PROCESS }),
                        ];
                    }),
                    catchError(err => {
                        const error: TypeError = err.error ? err.error : { Code: 399, Message: 'Something wrong' };
                        const alertOption: AlertOptions = <AlertOptions>{};
                        alertOption.Type = this._alertTypeDanger;
                        alertOption.TextColor = this._alertTextColor;
                        alertOption.Status = true;
                        alertOption.Message = this.languageConfig[this._appLanguage.Code].backend.errors[error.Code];
                        alertOption.CloseAction = new userActions.RemoveUserAlert({ action: userActions.FINISH_PENDING_PROCESS });
                        alertOption.ActionType = userActions.FINISH_PENDING_PROCESS;
                        return of(new userActions.AddUserAlert({ alertOption }));
                    })
                )),
        );

    @Effect()
    loadPendingProcesses$ = this._actions$
        .pipe(
            ofType<userActions.LoadPendingProcesses>(userActions.LOAD_PENDING_PROCESSES),
            map((action) => {
                this._store.dispatch(new uiActions.AddLoadingProcess({ process: userActions.LOAD_PENDING_PROCESSES }));
                return action;
            }),
            switchMap((action) => this._userService.getPendingProcesses(action.payload.userOid)
                .pipe(
                    switchMap((pendingProcesses: PendingProcesses) => {
                        return [
                            new userActions.SetPendingProcesses({ pendingProcesses }),
                            new uiActions.RemoveLoadingProcess({ process: userActions.LOAD_PENDING_PROCESSES }),
                        ];
                    }),
                    catchError(err => {
                        const error: TypeError = err.error ? err.error : { Code: 399, Message: 'Something wrong' };
                        const alertOption: AlertOptions = <AlertOptions>{};
                        alertOption.Type = this._alertTypeDanger;
                        alertOption.TextColor = this._alertTextColor;
                        alertOption.Status = true;
                        alertOption.Message = this.languageConfig[this._appLanguage.Code].backend.errors[error.Code];
                        alertOption.CloseAction = new userActions.RemoveUserAlert({ action: userActions.LOAD_PENDING_PROCESSES });
                        alertOption.ActionType = userActions.LOAD_PENDING_PROCESSES;
                        return of(new userActions.AddUserAlert({ alertOption }));
                    })
                )),
        );

    @Effect()
    loadUnconfirmedUsers$ = this._actions$
        .pipe(
            ofType<userActions.LoadUncofirmedUsers>(userActions.LOAD_UNCONFIRMED_USERS),
            map((action) => {
                this._store.dispatch(new uiActions.AddLoadingProcess({ process: userActions.LOAD_UNCONFIRMED_USERS }));
                return action;
            }),
            switchMap((action) => this._userService.getUnconfirmedUsers()
                .pipe(
                    switchMap((users: User[]) => {
                        return [
                            new userActions.SetUncofirmedUsers({ users }),
                            new uiActions.RemoveLoadingProcess({ process: userActions.LOAD_UNCONFIRMED_USERS }),
                        ];
                    }),
                    catchError(err => {
                        const error: TypeError = err.error ? err.error : { Code: 399, Message: 'Something wrong' };
                        const alertOption: AlertOptions = <AlertOptions>{};
                        alertOption.Type = this._alertTypeDanger;
                        alertOption.TextColor = this._alertTextColor;
                        alertOption.Status = true;
                        alertOption.Message = this.languageConfig[this._appLanguage.Code].backend.errors[error.Code];
                        alertOption.CloseAction = new userActions.RemoveUserAlert({ action: userActions.LOAD_UNCONFIRMED_USERS });
                        alertOption.ActionType = userActions.LOAD_UNCONFIRMED_USERS;
                        return of(new userActions.AddUserAlert({ alertOption }));
                    })
                )),
        );

    @Effect()
    addUserAlerts$ = this._actions$
        .pipe(
            ofType<userActions.AddUserAlert>(userActions.ADD_USER_ALERT),
            map((action) => new uiActions.RemoveLoadingProcess({ process: action.payload.alertOption.ActionType}))
        );
}
