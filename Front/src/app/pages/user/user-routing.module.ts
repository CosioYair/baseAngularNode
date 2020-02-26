import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BuyIcoComponent } from './buy-ico/buy-ico.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { RegisterGuardService } from 'src/app/guards/register-guard.service';
import { AuthGuardService } from 'src/app/guards/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  // tslint:disable-next-line: max-line-length
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule), canActivate: [AuthGuardService], data: { noAuth: true } },
  { path: 'home', component: HomeComponent, canActivate: [RegisterGuardService] },
  { path: 'buy-ico', component: BuyIcoComponent, canActivate: [RegisterGuardService] },
  { path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule), canActivate: [] },
  // tslint:disable-next-line: max-line-length
  { path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule), canActivate: [RegisterGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
