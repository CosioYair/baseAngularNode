import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Store } from '@ngrx/store';
import { AppState } from './store/reducers';
import * as fromStore from 'src/app/store/reducers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'sampleICO';
  private _loading: Boolean = false;

  constructor(private ngxService: NgxUiLoaderService,
    private _store: Store<AppState>
  ) { }

  ngOnInit() {
    this._store.select(fromStore.getLoadingProcesses)
      .subscribe(async loadingProcesses => {
        if (loadingProcesses.length > 0) {
          if (!this._loading) {
            this._loading = true;
            this.ngxService.start();
          }
        } else {
          if (this._loading) {
            this._loading = false;
            this.ngxService.stop();
          }
        }
      })
  }
}
