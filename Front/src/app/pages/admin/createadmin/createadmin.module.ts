import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateadminComponent } from './createadmin.component';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';

const routes: Routes = [
  {
    path: '',
    component: CreateadminComponent
  }
];

@NgModule({
  declarations: [CreateadminComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ]
})
export class CreateAdminModule { }
