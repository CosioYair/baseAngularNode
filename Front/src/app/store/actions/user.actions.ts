
import { Action } from '@ngrx/store';
import { User } from 'src/app/interfaces/user';
import { PendingProcesses } from 'src/app/interfaces/pending-processes';
import { AlertOptions } from 'src/app/interfaces/alert-options';

export const LOAD_USER = '[USER user] Load';
export const SET_USER = '[USER user] Set';
export const CREATE_USER = '[USER user] Create';
export const UPDATE_USER = '[USER user] Update';

export const LOAD_PENDING_PROCESSES = '[USER pending processes] Load';
export const SET_PENDING_PROCESSES = '[USER pending processes] Set';
export const FINISH_PENDING_PROCESS = '[USER pending process] Finish';

export const LOAD_UNCONFIRMED_USERS = '[USER unconfirmed users] Load';
export const SET_UNCONFIRMED_USERS = '[USER unconfirmed users] Set';

export const SET_USER_ALERTS = '[USER user alerts] Set';
export const ADD_USER_ALERT = '[USER user alert] Add';
export const REMOVE_USER_ALERT = '[USER user alert] Remove';

export class LoadUser implements Action {
    readonly type = LOAD_USER;
    constructor(public payload: { oid: string }) { }
}

export class SetUser implements Action {
    readonly type = SET_USER;
    constructor(public payload: { user: User }) { }
}

export class CreateUser implements Action {
    readonly type = CREATE_USER;
    constructor(public payload: {
        user: User,
        roleId: number,
        registerTypeId:
        number,
        confirmUrl?: string
    }) { }
}

export class UpdateUser implements Action {
    readonly type = UPDATE_USER;
    constructor(public payload: {
        oid: string,
        user: User,
        finishedProcessOid?: string
    }) { }
}

export class LoadPendingProcesses implements Action {
    readonly type = LOAD_PENDING_PROCESSES;
    constructor(public payload: { userOid: string }) { }
}

export class SetPendingProcesses implements Action {
    readonly type = SET_PENDING_PROCESSES;
    constructor(public payload: { pendingProcesses: PendingProcesses }) { }
}

export class FinishPendingProcess implements Action {
    readonly type = FINISH_PENDING_PROCESS;
    constructor(public payload: { oid: string, userOid: string }) { }
}

export class LoadUncofirmedUsers implements Action {
    readonly type = LOAD_UNCONFIRMED_USERS;
}

export class SetUncofirmedUsers implements Action {
    readonly type = SET_UNCONFIRMED_USERS;
    constructor(public payload: { users: User[] }) { }
}

export class SerUserAlerts implements Action {
    readonly type = SET_USER_ALERTS;
    constructor(public payload: { alertOptions: AlertOptions[] }) { }
}

export class AddUserAlert implements Action {
    readonly type = ADD_USER_ALERT;
    constructor(public payload: { alertOption: AlertOptions }) { }
}

export class RemoveUserAlert implements Action {
    readonly type = REMOVE_USER_ALERT;
    constructor(public payload: { action: string }) { }
}

export type Action = LoadUser
    | SetUser
    | CreateUser
    | UpdateUser
    | LoadPendingProcesses
    | SetPendingProcesses
    | FinishPendingProcess
    | LoadUncofirmedUsers
    | SetUncofirmedUsers
    | SerUserAlerts
    | AddUserAlert
    | RemoveUserAlert;
