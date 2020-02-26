
import { Action } from '@ngrx/store';
import { Error } from 'src/app/interfaces/error';
import { Tfa } from 'src/app/interfaces/tfa';

export const LOAD_ACTIVE_TFAS = '[TFA active tfas] Load';
export const SET_ACTIVE_TFAS = '[TFA active tfas] Set';

export const SET_ERROR = '[TFA error] Set';

export class LoadActiveTfas implements Action {
    readonly type = LOAD_ACTIVE_TFAS;
    constructor(public payload: { email: string }) { }
}

export class SetActiveTfas implements Action {
    readonly type = SET_ACTIVE_TFAS;
    constructor(public payload: { activeTfas: Tfa[] }) { }
}

export class SetError implements Action {
    readonly type = SET_ERROR;
    constructor(public payload: { error: Error }) { }
}

export type Action = LoadActiveTfas
| SetActiveTfas
| SetError;
