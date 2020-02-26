import * as userActions from '../actions/user.actions';
import { User } from 'src/app/interfaces/user';
import { AlertOptions } from 'src/app/interfaces/alert-options';
import { PendingProcesses } from 'src/app/interfaces/pending-processes';

export interface UserState {
    info: User;
    pendingProcesses: PendingProcesses;
    unconfirmedUsers: User[];
    userAlerts: AlertOptions[];
}

const initState: UserState = {
    info: <User>{},
    pendingProcesses: <PendingProcesses>{},
    unconfirmedUsers: [],
    userAlerts: [],
};

export function userReducer(state = initState, action: userActions.Action): UserState {
    switch (action.type) {
        case userActions.LOAD_USER:
            return {
                ...state
            };

        case userActions.SET_USER:
            return {
                ...state,
                info: action.payload.user
            };

        case userActions.CREATE_USER:
            return {
                ...state
            };

        case userActions.UPDATE_USER:
            return {
                ...state
            };

        case userActions.LOAD_PENDING_PROCESSES:
            return {
                ...state
            };

        case userActions.SET_PENDING_PROCESSES:
            return {
                ...state,
                pendingProcesses: action.payload.pendingProcesses
            };

        case userActions.FINISH_PENDING_PROCESS:
            return {
                ...state
            };

        case userActions.LOAD_UNCONFIRMED_USERS:
            return {
                ...state
            };

        case userActions.SET_UNCONFIRMED_USERS:
            return {
                ...state,
                unconfirmedUsers: action.payload.users
            };

        case userActions.SET_USER_ALERTS:
            return {
                ...state,
                userAlerts: action.payload.alertOptions
            };

        case userActions.ADD_USER_ALERT:
            const userAlerts = state.userAlerts.filter(item => item.ActionType !== action.payload.alertOption.ActionType);
            return {
                ...state,
                userAlerts: [...userAlerts, action.payload.alertOption]
            };

        case userActions.REMOVE_USER_ALERT:
            const newUserAlerts = state.userAlerts.filter(item => item.ActionType !== action.payload.action);
            return {
                ...state,
                userAlerts: newUserAlerts
            };

        default:
            return state;
    }
}

export const getUserInfo = (state: UserState) => state.info;
export const getPendingProcesses = (state: UserState) => state.pendingProcesses ? state.pendingProcesses : <PendingProcesses>{};
export const getUnconfirmedUsers = (state: UserState) => state.unconfirmedUsers ? state.unconfirmedUsers : [];
export const getUserAlerts = (state: UserState) => state.userAlerts;
