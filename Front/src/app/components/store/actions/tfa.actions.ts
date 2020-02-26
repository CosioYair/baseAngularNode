
import { Action } from '@ngrx/store';
import { Tfa } from 'src/app/interfaces/tfa';
import { TypeError } from 'src/app/interfaces/type-error';

export const LOAD_TFAS = '[TFA_MANAGER tfas] Load';
export const SET_TFAS = '[TFA_MANAGER tfas] Set';

export const ENABLE_TFA = '[TFA_MANAGER tfa] Enable';
export const DISABLE_TFA = '[TFA_MANAGER tfa] Disable';
export const SET_TFA_STATUS = '[TFA_MANAGER tfa status] Set';

export const SET_ERROR = '[TFA_MANAGER error] Set';

export class LoadTfas implements Action {
    readonly type = LOAD_TFAS;
}

export class SetTfas implements Action {
    readonly type = SET_TFAS;
    constructor(public payload: { tfas: Tfa[] }) { }
}

export class EnableTfa implements Action {
    readonly type = ENABLE_TFA;
    constructor(public payload: { id: number }) { }
}

export class DisableTfa implements Action {
    readonly type = DISABLE_TFA;
    constructor(public payload: { id: number }) { }
}

export class SetTfaStatus implements Action {
    readonly type = SET_TFA_STATUS;
    constructor(public payload: { id: number, status: boolean }) { }
}

export class SetError implements Action {
    readonly type = SET_ERROR;
    constructor(public payload: { error: TypeError }) { }
}

export type Action = LoadTfas
| SetTfas
| EnableTfa
| DisableTfa
| SetTfaStatus
| SetError;
