import * as tfaActions from '../actions/tfa.actions';
import { Error } from 'src/app/interfaces/error';
import { Tfa } from 'src/app/interfaces/tfa';

export interface TfaState {
    tfas: Tfa[];
    error: Error;
}

const initState: TfaState = {
    tfas: [],
    error: null
};

export function tfaReducer(state = initState, action: tfaActions.Action): TfaState {
    switch (action.type) {

        case tfaActions.LOAD_TFAS:
            return {
                ...state
            };

        case tfaActions.SET_TFAS:
            return {
                ...state,
                tfas: action.payload.tfas
            };

        case tfaActions.ENABLE_TFA:
            return {
                ...state
            };

        case tfaActions.DISABLE_TFA:
            return {
                ...state
            };

        case tfaActions.SET_TFA_STATUS:
            const tfas = [...state.tfas];
            const index = state.tfas.findIndex(tfa => tfa.Id === action.payload.id);
            tfas[index].Active = action.payload.status;
            return {
                ...state,
                tfas
            };

        case tfaActions.SET_ERROR:
            return {
                ...state,
                error: action.payload.error
            };

        default:
            return state;
    }
}

export const getTfas = (state: TfaState) => state.tfas;
export const getError = (state: TfaState) => state.error;
