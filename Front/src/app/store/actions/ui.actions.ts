
import { Action } from '@ngrx/store';
import { Language } from 'src/app/interfaces/language';
import { Error } from 'src/app/interfaces/error';
import { AlertOptions } from 'src/app/interfaces/alert-options';

export const ADD_LOADING_PROCESS = '[UI loader] Loading...';
export const REMOVE_LOADING_PROCESS = '[UI loader] Loaded...';

export const LOAD_LANGUAGES = '[UI languages] Load';
export const SET_LANGUAGES = '[UI languages] Set';
export const SET_APP_LANGUAGE = '[UI app language] Set';

export const SET_UI_ALERTS = '[UI alerts] Set';
export const ADD_UI_ALERT = '[UI alert] Add';
export const REMOVE_UI_ALERT = '[UI alert] Remove';

export class AddLoadingProcess implements Action {
    readonly type = ADD_LOADING_PROCESS;
    constructor(public payload: { process: string }) { }
}

export class RemoveLoadingProcess implements Action {
    readonly type = REMOVE_LOADING_PROCESS;
    constructor(public payload: { process: string }) { }
}

export class LoadLanguages implements Action {
    readonly type = LOAD_LANGUAGES;
}

export class SetLanguages implements Action {
    readonly type = SET_LANGUAGES;
    constructor(public payload: { languages: Language[] }) { }
}

export class SetAppLanguage implements Action {
    readonly type = SET_APP_LANGUAGE;
    constructor(public payload: { language: Language }) { }
}

export class SetUiAlerts implements Action {
    readonly type = SET_UI_ALERTS;
    constructor(public payload: { alertOptions: AlertOptions[] }) { }
}

export class AddUiAlert implements Action {
    readonly type = ADD_UI_ALERT;
    constructor(public payload: { alertOption: AlertOptions }) { }
}

export class RemoveUiAlert implements Action {
    readonly type = REMOVE_UI_ALERT;
    constructor(public payload: { action: string }) { }
}

export type Action = AddLoadingProcess
    | RemoveLoadingProcess
    | LoadLanguages
    | SetLanguages
    | SetAppLanguage
    | SetUiAlerts
    | AddUiAlert
    | RemoveUiAlert;
