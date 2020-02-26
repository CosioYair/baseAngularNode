import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuperadminGuard } from 'src/app/guards/superadmin.guard';
import { AuthGuardService } from 'src/app/guards/auth-guard.service';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  // tslint:disable-next-line: max-line-length
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule), canActivate: [AuthGuardService], data: { noAuth: true } },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: 'confirmUsers', loadChildren: () => import('./confirm/confirm.module').then(m => m.ConfirmModule) },
  // tslint:disable-next-line: max-line-length
  { path: 'createAdmin', loadChildren: () => import('./createadmin/createadmin.module').then(m => m.CreateAdminModule), canActivate: [SuperadminGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
