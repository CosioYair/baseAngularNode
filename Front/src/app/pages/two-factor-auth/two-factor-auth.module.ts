import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';
import { TwoFactorAuthComponent } from './two-factor-auth.component';
import { tfaReducers } from './store/reducers';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TfaEffects } from './store/effects';

const routes: Routes = [
  {
    path: '',
    component: TwoFactorAuthComponent
  }
];

@NgModule({
  declarations: [TwoFactorAuthComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ComponentsModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature('tfa', tfaReducers),
    EffectsModule.forFeature(TfaEffects),
  ]
})
export class TwoFactorAuthModule { }
