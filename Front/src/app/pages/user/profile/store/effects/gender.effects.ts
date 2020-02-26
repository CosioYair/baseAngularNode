import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { GenderState } from '../reducers/gender.reducer';
import * as genderActions from '../actions/gender.actions';
import * as uiActions from 'src/app/store/actions/ui.actions';
import { map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Gender } from 'src/app/interfaces/gender';
import { GenderService } from 'src/app/services/gender.service';

@Injectable()
export class GenderEffects {

    constructor(private _store: Store<GenderState>,
        private _actions$: Actions,
        private _genderService: GenderService) { }

    @Effect()
    loadGenders$ = this._actions$
        .pipe(
            ofType<genderActions.LoadGenders>(genderActions.LOAD_GENDERS),
            map((action) => {
                this._store.dispatch(new uiActions.AddLoadingProcess({ process: genderActions.LOAD_GENDERS }));
                return action;
            }),
            switchMap((action) =>
                this._genderService.getGenders(action.payload.languageId)
                    .pipe(
                        switchMap((genders: Gender[]) => {
                            return [
                                new genderActions.SetGenders({ genders }),
                                new uiActions.RemoveLoadingProcess({ process: genderActions.LOAD_GENDERS })
                            ];
                        }),
                        catchError(err => {
                            const error = err.error ? err.error : { Code: 399, Message: 'Something wrong' };
                            return of(new genderActions.SetError({ error }));
                        })
                    )),
        );

    @Effect()
    setError$ = this._actions$
        .pipe(
            ofType<genderActions.SetError>(genderActions.SET_ERROR),
            map((action) => new uiActions.RemoveLoadingProcess({ process: genderActions.LOAD_GENDERS }))
        );

}
