import * as activeTfasActions from '../actions/active-tfas.actions';
import { Error } from 'src/app/interfaces/error';
import { Tfa } from 'src/app/interfaces/tfa';

export interface ActiveTfasState {
    activeTfas: Tfa[];
    error: Error;
}

const initState: ActiveTfasState = {
    activeTfas: [],
    error: null
};

export function activeTfasReducer(state = initState, action: activeTfasActions.Action): ActiveTfasState {
    switch (action.type) {

        case activeTfasActions.LOAD_ACTIVE_TFAS:
            return {
                ...state
            };

        case activeTfasActions.SET_ACTIVE_TFAS:
            return {
                ...state,
                activeTfas: action.payload.activeTfas
            };

        case activeTfasActions.SET_ERROR:
            return {
                ...state,
                error: action.payload.error
            };

        default:
            return state;
    }
}

export const getActiveTfas = (state: ActiveTfasState) => state.activeTfas;
export const getError = (state: ActiveTfasState) => state.error;
