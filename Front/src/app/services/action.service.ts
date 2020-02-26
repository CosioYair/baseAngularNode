import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ActionService {

  private _api: String = 'http://localhost:3000/api';

  constructor(private _http: HttpClient) { }

  confirmToken(token: string, payload?: any) {
    return this._http.post(`${this._api}/actions/confirmToken`, {
      Token: token,
      Payload: payload
    }, { withCredentials: true });
  }

  validateToken(token: string) {
    return this._http.get(`${this._api}/actions/validateToken`, {
      params: {
        Token: token
      }
    });
  }

  newActionByUserEmail(userEmail: string, languageId: number, actionId: number, hostUrl: string = null) {
    return this._http.post(`${this._api}/actions/newActionByUserEmail`, {
      ActionId: actionId,
      UserEmail: userEmail,
      HostUrl: hostUrl,
      LanguageId: languageId
    }).pipe(
      map(response => response['Token'])
    );
  }

  newActionByToken(oldToken: string, languageId: number, hostUrl: string = null) {
    return this._http.post(`${this._api}/actions/newActionByToken`, {
      Token: oldToken,
      HostUrl: hostUrl,
      LanguageId: languageId
    });
  }
}
