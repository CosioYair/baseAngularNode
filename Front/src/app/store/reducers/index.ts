import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromUi from './ui.reducer';
import * as fromAuth from './auth.reducer';
import * as fromUser from './user.reducer';
import * as fromTokenActions from './token-actions.reducer';

export interface AppState {
    ui: fromUi.UiState;
    auth: fromAuth.AuthState;
    user: fromUser.UserState;
    tokenActions: fromTokenActions.TokenActionsState;
}

export const appReducers: ActionReducerMap<AppState> = {
    ui: fromUi.uiReducer,
    auth: fromAuth.auhtReducer,
    user: fromUser.userReducer,
    tokenActions: fromTokenActions.tokenActionsReducer
};

export const getAuthState = createFeatureSelector<fromAuth.AuthState>('auth');
export const getJwt = createSelector(getAuthState, fromAuth.getJwt);
export const getDecodeJwt = createSelector(getAuthState, fromAuth.getDecodedJwt);
export const getAuthAlerts = createSelector(getAuthState, fromAuth.getAuthAlerts);
export const getAuthAlert = createSelector(getAuthAlerts, (authAlerts, props) => {
    return authAlerts.find(alertOption => alertOption.ActionType === props.actionType);
});

export const getUiState = createFeatureSelector<fromUi.UiState>('ui');
export const getLoadingProcesses = createSelector(getUiState, fromUi.getLoadingProcesses);
export const getLanguages = createSelector(getUiState, fromUi.getLanguages);
export const getAppLanguage = createSelector(getUiState, fromUi.getApplanguage);
export const getUiAlerts = createSelector(getUiState, fromUi.getUiAlerts);
export const getUiAlert = createSelector(getUiAlerts, (uiAlerts, props) => {
    return uiAlerts.find(alertOption => alertOption.ActionType === props.actionType);
});

export const getUserState = createFeatureSelector<fromUser.UserState>('user');
export const getUserInfo = createSelector(getUserState, fromUser.getUserInfo);
export const getUserAlerts = createSelector(getUserState, fromUser.getUserAlerts);
export const getUserAlert = createSelector(getUserAlerts, (userAlerts, props) => {
    return userAlerts.find(alertOption => alertOption.ActionType === props.actionType);
});

export const getPendingProcesses = createSelector(getUserState, fromUser.getPendingProcesses);
export const getPendingProcess = createSelector(getPendingProcesses, (pendingProcesses, props) => {
    return pendingProcesses[props.process];
});
export const getUnconfirmedUsers = createSelector(getUserState, fromUser.getUnconfirmedUsers);

export const getTokenActionsState = createFeatureSelector<fromTokenActions.TokenActionsState>('tokenActions');
export const getEmailSendStatus = createSelector(getTokenActionsState, fromTokenActions.getEmailSendStatus);
export const getValidTokenStatus = createSelector(getTokenActionsState, fromTokenActions.getValidTokenStatus);
export const getConfirmedTokenStatus = createSelector(getTokenActionsState, fromTokenActions.getConfirmedTokenStatus);
export const getTokenActionsError = createSelector(getTokenActionsState, fromTokenActions.getError);
