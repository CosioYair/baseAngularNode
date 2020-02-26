import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AlertComponent } from './alert/alert.component';
import { ReactiveFormsModule } from '@angular/forms';
import { componentsReducers } from './store/reducers';
import { ComponentsEffects } from './store/effects';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TwoFactorAuthManagerComponent } from './two-factor-auth-manager/two-factor-auth-manager.component';

@NgModule({
  declarations: [MenuComponent, AlertComponent, TwoFactorAuthManagerComponent],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NgbModule,
    StoreModule.forFeature('components', componentsReducers),
    EffectsModule.forFeature(ComponentsEffects),
  ],
  exports: [
    MenuComponent,
    AlertComponent,
    TwoFactorAuthManagerComponent
  ]
})
export class ComponentsModule { }
