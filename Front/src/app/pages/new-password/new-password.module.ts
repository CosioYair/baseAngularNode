import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RecaptchaModule } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';
import { ComponentsModule } from 'src/app/components/components.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NewPasswordComponent } from './new-password.component';

const routes: Routes = [
  {
    path: '',
    component: NewPasswordComponent
  }
];

@NgModule({
  declarations: [NewPasswordComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    ComponentsModule,
    NgbModule,
    RouterModule.forChild(routes),
  ]
})
export class NewPasswordModule { }
