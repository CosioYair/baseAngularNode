import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailConfirmationComponent } from './email-confirmation.component';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';

const routes: Routes = [
  {
    path: '',
    component: EmailConfirmationComponent
  }
];

@NgModule({
  declarations: [EmailConfirmationComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ComponentsModule,
    RouterModule.forChild(routes),
  ]
})
export class EmailConfirmationModule { }
