import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  constructor(private _http: HttpClient) { }

  postMail(email: string, subject: string, body: string) {
    return this._http.post('http://localhost:3000/api/mail/postMail', {
      Email: email,
      Subject: subject,
      Body: body
    }).toPromise();
  }
}
