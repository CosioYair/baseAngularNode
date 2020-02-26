import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromActiveTfas from './active-tfas.reducer';
import * as fromStore from 'src/app/store/reducers';

export interface TfaState {
    activeTfas: fromActiveTfas.ActiveTfasState;
}

export const tfaReducers: ActionReducerMap<TfaState> = {
    activeTfas: fromActiveTfas.activeTfasReducer
};

export interface AppState extends fromStore.AppState {
    newPassword: TfaState;
}

export const getTfaState = createFeatureSelector<TfaState>('tfa');

export const getActiveTfasState = createSelector(getTfaState, (state: TfaState) => state.activeTfas);
export const getActiveTfas = createSelector(getActiveTfasState, fromActiveTfas.getActiveTfas);
export const getError = createSelector(getActiveTfasState, fromActiveTfas.getError);
