import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './guards/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'introduction', pathMatch: 'full' },
  { path: 'introduction', loadChildren: () => import('./pages/introduction/introduction.module').then(m => m.IntroductionModule) },
  // tslint:disable-next-line: max-line-length
  { path: 'newPassword', loadChildren: () => import('./pages/new-password/new-password.module').then(m => m.NewPasswordModule), canActivate: [] },
  // tslint:disable-next-line: max-line-length
  { path: 'deviceConfirmation', loadChildren: () => import('./pages/device-confirmation/device-confirmation.module').then(m => m.DeviceConfirmationModule), canActivate: [] },
  // tslint:disable-next-line: max-line-length
  { path: 'twoFactorAuth', loadChildren: () => import('./pages/two-factor-auth/two-factor-auth.module').then(m => m.TwoFactorAuthModule), canActivate: [AuthGuardService], data: { noAuth: true } },
  // tslint:disable-next-line: max-line-length
  { path: 'emailConfirmation', loadChildren: () => import('./pages/email-confirmation/email-confirmation.module').then(m => m.EmailConfirmationModule), canActivate: [] },
  { path: 'user', loadChildren: () => import('./pages/user/user.module').then(m => m.UserModule), canActivate: [] },
  // tslint:disable-next-line: max-line-length
  { path: 'admin', loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule), canActivate: [] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
