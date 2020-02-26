
import { Action } from '@ngrx/store';
import { DecodedJwt } from 'src/app/interfaces/decoded-jwt';
import { Error } from 'src/app/interfaces/error';
import { AlertOptions } from 'src/app/interfaces/alert-options';

export const LOAD_LOGIN = '[AUTH login] Load';
export const LOCAL_LOGIN = '[AUTH login] Local';
export const SIGNUP_LOGIN = '[AUTH login] Signup';

export const SET_IS_AUTH = '[AUTH is auth] Set';

export const SET_JWT = '[AUTH jwt data] Set';

export const SET_DECODED_JWT = '[AUTH decoded jwt data] Set';

export const SET_AUTH_ALERTS = '[AUTH alerts] Set';
export const ADD_AUTH_ALERT = '[AUTH alert] Add';
export const REMOVE_AUTH_ALERT = '[AUTH alert] Remove';

export class LocalLogin implements Action {
    readonly type = LOCAL_LOGIN;
    constructor(public payload: {
        email: string,
        password: string,
        roleId: any,
        tfaId?: number,
        tfaToken?: string
    }) { }
}

export class SignupLogin implements Action {
    readonly type = SIGNUP_LOGIN;
    constructor(public payload: {
        email: string,
        password: string,
        roleId: string,
    }) { }
}

export class SetIsAuth implements Action {
    readonly type = SET_IS_AUTH;
    constructor(public payload: { isAuth: Boolean }) { }
}

export class SetJwt implements Action {
    readonly type = SET_JWT;
    constructor(public payload: { jwt: string }) { }
}

export class SetDecodedJwt implements Action {
    readonly type = SET_DECODED_JWT;
    constructor(public payload: { decodedJwt: DecodedJwt }) { }
}

export class SetAuthAlerts implements Action {
    readonly type = SET_AUTH_ALERTS;
    constructor(public payload: { alertOptions: AlertOptions[] }) { }
}

export class AddAuthAlert implements Action {
    readonly type = ADD_AUTH_ALERT;
    constructor(public payload: { alertOption: AlertOptions }) { }
}

export class RemoveAuthAlert implements Action {
    readonly type = REMOVE_AUTH_ALERT;
    constructor(public payload: { action: string }) { }
}

export type Action = LocalLogin
    | SignupLogin
    | SetIsAuth
    | SetJwt
    | SetDecodedJwt
    | SetAuthAlerts
    | AddAuthAlert
    | RemoveAuthAlert;
