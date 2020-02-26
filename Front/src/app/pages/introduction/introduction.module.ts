import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntroductionComponent } from './introduction.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: IntroductionComponent
  }
];

@NgModule({
  declarations: [IntroductionComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class IntroductionModule { }
