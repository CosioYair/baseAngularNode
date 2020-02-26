
import { Action } from '@ngrx/store';
import { Error } from 'src/app/interfaces/error';
import { Gender } from 'src/app/interfaces/gender';

export const LOAD_GENDERS = '[PROFILE genders] Load';
export const SET_GENDERS = '[PROFILE genders] Set';

export const SET_ERROR = '[PROFILE error] Set';

export class LoadGenders implements Action {
    readonly type = LOAD_GENDERS;
    constructor(public payload: { languageId: string }) { }
}

export class SetGenders implements Action {
    readonly type = SET_GENDERS;
    constructor(public payload: { genders: Gender[] }) { }
}

export class SetError implements Action {
    readonly type = SET_ERROR;
    constructor(public payload: { error: Error }) { }
}

export type Action = LoadGenders
| SetGenders
| SetError;
