import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'register/psychologist',
    loadChildren: () => import('./pages/register-psychologist/register-psychologist.module').then(m => m.RegisterPsychologistPageModule)
  },
  {
    path: 'menu-patient',
    loadChildren: () => import('./pages/menu-patient/menu-patient.module').then(m => m.MenuPatientPageModule),
    //canActivate: [AuthGuard, RoleGuard],
    //data: { expectedRole: 'PATIENT' }
  },
  {
    path: 'psychologist-navbar',
    loadChildren: () => import('./pages/psychologist-navbar/psychologist-navbar.module').then(m => m.PsychologistNavbarPageModule),
    //canActivate: [AuthGuard, RoleGuard],
    //data: { expectedRole: 'PSYCHOLOGIST' }

  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
