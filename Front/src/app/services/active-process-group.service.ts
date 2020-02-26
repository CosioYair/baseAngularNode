import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Process } from '../interfaces/process';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ActiveProcessGroupService {

  private _api: String = 'http://localhost:3000/api';

  constructor(private _http: HttpClient) {
  }

  finishProcess(activeProcessGroupOid: string): Observable<Process> {
    return this._http.put(`${this._api}/activeProcessGroups/finish/${activeProcessGroupOid}`, {})
    .pipe(
      map(response => response['ActiveProcessGroup'])
    );
  }
}
