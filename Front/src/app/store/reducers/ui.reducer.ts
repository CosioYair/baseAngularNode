import * as uiActions from '../actions/ui.actions';
import { Language } from 'src/app/interfaces/language';
import { Error } from 'src/app/interfaces/error';
import { AlertOptions } from 'src/app/interfaces/alert-options';

export interface UiState {
    loadingProcesses: string[];
    languages: Language[];
    appLanguage: Language;
    uiAlerts: AlertOptions[];
}

const initState: UiState = {
    loadingProcesses: [],
    languages: [],
    appLanguage: {
        Id: 1,
        Code: 'es',
        Name: 'Spanish',
        DisplayText: 'Español'
    },
    uiAlerts: []
};

export function uiReducer(state = initState, action: uiActions.Action): UiState {
    switch (action.type) {
        case uiActions.ADD_LOADING_PROCESS:
            return {
                ...state,
                loadingProcesses: [...state.loadingProcesses, action.payload.process]
            };

        case uiActions.REMOVE_LOADING_PROCESS:
            const newLoadingProcesses = state.loadingProcesses.filter(item => item !== action.payload.process);
            return {
                ...state,
                loadingProcesses: newLoadingProcesses
            };

        case uiActions.LOAD_LANGUAGES:
            return {
                ...state
            };

        case uiActions.SET_LANGUAGES:
            return {
                ...state,
                languages: action.payload.languages
            };

        case uiActions.SET_APP_LANGUAGE:
            return {
                ...state,
                appLanguage: action.payload.language
            };

        case uiActions.SET_UI_ALERTS:
            return {
                ...state,
                uiAlerts: action.payload.alertOptions
            };

        case uiActions.ADD_UI_ALERT:
            const uiAlerts = state.uiAlerts.filter(item => item.ActionType !== action.payload.alertOption.ActionType);
            return {
                ...state,
                uiAlerts: [...uiAlerts, action.payload.alertOption]
            };

        case uiActions.REMOVE_UI_ALERT:
            const newUiAlerts = state.uiAlerts.filter(item => item.ActionType !== action.payload.action);
            return {
                ...state,
                uiAlerts: newUiAlerts
            };

        default:
            return state;
    }
}

export const getLoadingProcesses = (state: UiState) => state.loadingProcesses;
export const getLanguages = (state: UiState) => state.languages;
export const getApplanguage = (state: UiState) => state.appLanguage;
export const getUiAlerts = (state: UiState) => state.uiAlerts;

