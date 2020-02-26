import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromTfa from './tfa.reducer';
import * as fromStore from 'src/app/store/reducers';

export interface ComponentsState {
    tfa: fromTfa.TfaState;
}

export const componentsReducers: ActionReducerMap<ComponentsState> = {
    tfa: fromTfa.tfaReducer
};

export interface AppState extends fromStore.AppState {
    components: ComponentsState;
}

export const getComponentsState = createFeatureSelector<ComponentsState>('components');

export const getTfaState = createSelector(getComponentsState, (state: ComponentsState) => state.tfa);
export const getTfas = createSelector(getTfaState, fromTfa.getTfas);
export const getError = createSelector(getTfaState, fromTfa.getError);
