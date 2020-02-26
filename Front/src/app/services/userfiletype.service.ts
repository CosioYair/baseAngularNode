import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserfiletypeService {

  constructor(private _http: HttpClient) { }

  getAll() {
    return this._http.get('http://localhost:3000/api/userfiletypes').toPromise();
  }

  getByUser(userOid) {
    return this._http.get(`http://localhost:3000/api/userfiletypes/${userOid}`).toPromise();
  }
}
