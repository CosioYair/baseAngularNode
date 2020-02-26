
import { Action } from '@ngrx/store';
import { TypeError } from 'src/app/interfaces/type-error';

export const NEW_TOKEN_BY_EMAIL = '[TOKEN_ACTIONS new token] By email';
export const NEW_TOKEN_BY_OLD_TOKEN = '[TOKEN_ACTIONS new token] By old token';
export const SET_EMAIL_SEND_STATUS = '[TOKEN_ACTIONS email send status] Set';

export const VALIDATE_TOKEN = '[TOKEN_ACTIONS token] Validate';
export const SET_VALID_TOKEN_STATUS = '[TOKEN_ACTIONS token status] Set';

export const CONFIRM_TOKEN = '[TOKEN_ACTIONS new password] Update';
export const SET_CONFIRMED_TOKEN_STATUS = '[TOKEN_ACTIONS password status] Set';


export const SET_ERROR = '[TOKEN_ACTIONS error] Set';

export class NewTokenByEmail implements Action {
    readonly type = NEW_TOKEN_BY_EMAIL;
    constructor(public payload: { actionId: number, laguageId: number, email: string }) { }
}

export class NewTokenByOldToken implements Action {
    readonly type = NEW_TOKEN_BY_OLD_TOKEN;
    constructor(public payload: { token: string, laguageId: number }) { }
}

export class SetEmailSendStatus implements Action {
    readonly type = SET_EMAIL_SEND_STATUS;
    constructor(public payload: { status: Boolean }) { }
}

export class ValidateToken implements Action {
    readonly type = VALIDATE_TOKEN;
    constructor(public payload: { token: string }) { }
}

export class SetValidTokenStatus implements Action {
    readonly type = SET_VALID_TOKEN_STATUS;
    constructor(public payload: { status: Boolean }) { }
}

export class ConfirmToken implements Action {
    readonly type = CONFIRM_TOKEN;
    constructor(public payload: { token: string, payload?: any }) { }
}

export class SetConfirmedTokenStatus implements Action {
    readonly type = SET_CONFIRMED_TOKEN_STATUS;
    constructor(public payload: { status: Boolean }) { }
}

export class SetError implements Action {
    readonly type = SET_ERROR;
    constructor(public payload: { error: TypeError }) { }
}

export type Action = NewTokenByEmail
| NewTokenByOldToken
| SetEmailSendStatus
| ValidateToken
| SetValidTokenStatus
| ConfirmToken
| SetConfirmedTokenStatus
| SetError;
