import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private _userData: any;

  constructor(private _store: Store<AppState>) {
  }

  ngOnInit() {
    this._store.select('auth').subscribe(auth => {
      this._userData = auth;
    });
  }

}
