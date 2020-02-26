import { Component, OnInit, Input } from '@angular/core';
import { AlertOptions } from 'src/app/interfaces/alert-options';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  @Input() alertOptions: AlertOptions;

  constructor(private _store: Store<AppState>) {
  }

  ngOnInit() {
    this.alertOptions.Close = this.alertOptions.Close === undefined ? true : this.alertOptions.Close;
  }

  close() {
    this.alertOptions.Status = false;
    if (this.alertOptions.CloseAction) {
      this._store.dispatch(this.alertOptions.CloseAction);
    }
  }

}
