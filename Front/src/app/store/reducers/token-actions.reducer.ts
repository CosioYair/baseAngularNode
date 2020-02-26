import * as tokenActions from '../actions/token-actions.actions';
import { TypeError } from 'src/app/interfaces/type-error';

export interface TokenActionsState {
    emailSendStatus: Boolean;
    validTokenStatus: Boolean;
    confirmedTokenStatus: Boolean;
    error: TypeError;
}

const initState: TokenActionsState = {
    emailSendStatus: false,
    validTokenStatus: false,
    confirmedTokenStatus: false,
    error: null
};

export function tokenActionsReducer(state = initState, action: tokenActions.Action): TokenActionsState {
    switch (action.type) {

        case tokenActions.NEW_TOKEN_BY_EMAIL:
            return {
                ...state
            };

        case tokenActions.NEW_TOKEN_BY_OLD_TOKEN:
            return {
                ...state
            };

        case tokenActions.SET_EMAIL_SEND_STATUS:
            return {
                ...state,
                emailSendStatus: action.payload.status
            };

        case tokenActions.VALIDATE_TOKEN:
            return {
                ...state
            };

        case tokenActions.SET_VALID_TOKEN_STATUS:
            return {
                ...state,
                validTokenStatus: action.payload.status
            };

        case tokenActions.CONFIRM_TOKEN:
            return {
                ...state
            };

        case tokenActions.SET_CONFIRMED_TOKEN_STATUS:
            return {
                ...state,
                confirmedTokenStatus: action.payload.status
            };

        case tokenActions.SET_ERROR:
            return {
                ...state,
                error: action.payload.error
            };

        default:
            return state;
    }
}

export const getEmailSendStatus = (state: TokenActionsState) => state.emailSendStatus;
export const getValidTokenStatus = (state: TokenActionsState) => state.validTokenStatus;
export const getConfirmedTokenStatus = (state: TokenActionsState) => state.confirmedTokenStatus;
export const getError = (state: TokenActionsState) => state.error;
