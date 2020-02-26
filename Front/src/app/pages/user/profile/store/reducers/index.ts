import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromStore from 'src/app/store/reducers';
import * as fromGender from './gender.reducer';

export interface ProfileState {
    gender: fromGender.GenderState;
}

export const profileReducers: ActionReducerMap<ProfileState> = {
    gender: fromGender.genderReducer
};

export interface AppState extends fromStore.AppState {
    profile: ProfileState;
}

export const getProfileState = createFeatureSelector<ProfileState>('profile');

export const getGenderState = createSelector(getProfileState, (state: ProfileState) => state.gender);
export const getGenders = createSelector(getGenderState, fromGender.getGenders);
export const getError = createSelector(getGenderState, fromGender.getError);
