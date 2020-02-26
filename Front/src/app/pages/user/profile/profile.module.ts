import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { profileReducers } from './store/reducers';
import { ProfileEffects } from './store/effects';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent
  }
];

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ComponentsModule,
    NgbModule,
    FileUploadModule,
    NgxIntlTelInputModule,
    GooglePlaceModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature('profile', profileReducers),
    EffectsModule.forFeature(ProfileEffects),
  ]
})
export class ProfileModule { }
