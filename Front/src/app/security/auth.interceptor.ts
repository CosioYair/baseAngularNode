import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/reducers';
import * as fromStore from '../store/reducers';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {


    constructor(private _store: Store<AppState>) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let jwt = '';
        this._store.select(fromStore.getAuthState)
            .subscribe(auth => {
                jwt = auth.jwt ? auth.jwt : '';
            });
        const clonedRequest = req.clone({ headers: req.headers.set('Authorization', `Bearer ${jwt}`) });
        return next.handle(clonedRequest);
    }

}