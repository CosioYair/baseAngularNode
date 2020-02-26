import { Action } from '@ngrx/store';
import * as fromAuth from '../actions/auth.actions';
import * as fromUi from '../actions/ui.actions';
import * as fromUser from '../actions/user.actions';
import * as fromTokenActions from '../actions/token-actions.actions';

export const authActions = fromAuth;
export const uiActions = fromUi;
export const userActions = fromUser;
export const tokenActions = fromTokenActions;

export const LOGOUT = '[App] logout';

export class Logout implements Action {
    readonly type = LOGOUT;
}
