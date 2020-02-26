import { LOGOUT } from '../actions';

export function appMetaReducer(reducer) {
  return function (state, action) {
    if (action.type === LOGOUT) {
      state = undefined;
    }
    return reducer(state, action);
  };
}
