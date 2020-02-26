import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GenderService {

  private _api: String = 'http://localhost:3000/api';

  constructor(private _http: HttpClient) { }

  getGenders(languageId: string) {
    return this._http.get(`${this._api}/genders`, {
      params: {
        LanguageId: languageId
      }
    }).pipe(
      map(response => response['Genders'])
    );
  }
}
