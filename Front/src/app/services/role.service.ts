import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private _api: String = 'http://localhost:3000/api';

  constructor(private _http: HttpClient) { }

  public getRoles(languageId: string) {
    return this._http.get(`${this._api}/roles`, {
      params: {
        LanguageId: languageId
      }
    }).pipe(
      map(response => response['Roles'])
    );
  }
}
