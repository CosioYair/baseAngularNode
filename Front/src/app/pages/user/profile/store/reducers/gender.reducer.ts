import * as genderActions from '../actions/gender.actions';
import { Error } from 'src/app/interfaces/error';
import { Gender } from 'src/app/interfaces/gender';

export interface GenderState {
    genders: Gender[];
    error: Error;
}

const initState: GenderState = {
    genders: [],
    error: null
};

export function genderReducer(state = initState, action: genderActions.Action): GenderState {
    switch (action.type) {

        case genderActions.LOAD_GENDERS:
            return {
                ...state
            };

        case genderActions.SET_GENDERS:
            return {
                ...state,
                genders: action.payload.genders
            };

        case genderActions.SET_ERROR:
            return {
                ...state,
                error: action.payload.error
            };

        default:
            return state;
    }
}

export const getGenders = (state: GenderState) => state.genders;
export const getError = (state: GenderState) => state.error;
