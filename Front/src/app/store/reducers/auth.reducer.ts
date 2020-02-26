import * as authActions from '../actions/auth.actions';
import { DecodedJwt } from 'src/app/interfaces/decoded-jwt';
import { Error } from 'src/app/interfaces/error';
import { AlertOptions } from 'src/app/interfaces/alert-options';

export interface AuthState {
    jwt: string;
    decodedJwt: DecodedJwt;
    isAuth: Boolean;
    authAlerts: AlertOptions[];
}

const initState: AuthState = {
    jwt: null,
    decodedJwt: <DecodedJwt>{},
    isAuth: false,
    authAlerts: []
};

export function auhtReducer(state = initState, action: authActions.Action): AuthState {
    switch (action.type) {
        case authActions.LOCAL_LOGIN:
            return {
                ...state
            };

        case authActions.SIGNUP_LOGIN:
            return {
                ...state
            };

        case authActions.SET_IS_AUTH:
            return {
                ...state,
                isAuth: action.payload.isAuth
            };

        case authActions.SET_JWT:
            return {
                ...state,
                jwt: action.payload.jwt
            };

        case authActions.SET_DECODED_JWT:
            return {
                ...state,
                decodedJwt: action.payload.decodedJwt
            };

        case authActions.SET_AUTH_ALERTS:
            return {
                ...state,
                authAlerts: action.payload.alertOptions
            };

        case authActions.ADD_AUTH_ALERT:
            const authAlerts = state.authAlerts.filter(item => item.ActionType !== action.payload.alertOption.ActionType);
            return {
                ...state,
                authAlerts: [...authAlerts, action.payload.alertOption]
            };

        case authActions.REMOVE_AUTH_ALERT:
            const newUiAlerts = state.authAlerts.filter(item => item.ActionType !== action.payload.action);
            return {
                ...state,
                authAlerts: newUiAlerts
            };

        default:
            return state;
    }
}

export const getJwt = (state: AuthState) => state.jwt;
export const getDecodedJwt = (state: AuthState) => state.decodedJwt;
export const getAuthAlerts = (state: AuthState) => state.authAlerts;
