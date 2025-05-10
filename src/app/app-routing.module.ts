import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { PatientGuard } from './guards/patient.guard';
import { PsychologistGuard } from './guards/psychologist.guard';

const routes: Routes = [
  // Redirección inicial → a login
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Rutas públicas
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

  // RUTAS DE PATIENT protegidas por PatientGuard
  {
    path: 'patient',
    loadChildren: () => import('./pages/patient-tabs/patient-tabs.module').then(m => m.PatientTabsPageModule),
    canActivate: [PatientGuard]
  },
  {
    path: 'register-day-modal',
    loadChildren: () => import('./pages/register-day-modal/register-day-modal.module').then(m => m.RegisterDayModalPageModule),
    canActivate: [PatientGuard]
  },
  {
    path: 'schedule-appointment/:id',
    loadChildren: () => import('./pages/schedule-appointment/schedule-appointment.module').then(m => m.ScheduleAppointmentPageModule),
    canActivate: [PatientGuard]
  },
  {
    path: 'confirm-appointment',
    loadChildren: () => import('./pages/confirm-appointment/confirm-appointment.module').then(m => m.ConfirmAppointmentPageModule),
    canActivate: [PatientGuard]
  },

  // RUTAS DE PSYCHOLOGIST protegidas por PsychologistGuard
  {
    path: 'calendar',
    loadChildren: () => import('./pages/calendar/calendar.module').then(m => m.CalendarPageModule),
    canActivate: [PsychologistGuard]
  },
  {
    path: 'working-hour-modal',
    loadChildren: () => import('./pages/working-hour-modal/working-hour-modal.module').then(m => m.WorkingHourModalPageModule),
    canActivate: [PsychologistGuard]
  },
  {
    path: 'appointment-requests',
    loadChildren: () => import('./pages/appointment-requests/appointment-requests.module').then(m => m.AppointmentRequestsPageModule),
    canActivate: [PsychologistGuard]
  },
  {
    path: 'psychologist-navbar',
    loadChildren: () => import('./pages/psychologist-navbar/psychologist-navbar.module').then(m => m.PsychologistNavbarPageModule),
    canActivate: [PsychologistGuard]
  },
  {
    path: 'search-patient',
    loadChildren: () => import('./pages/search-patient/search-patient.module').then(m => m.SearchPatientPageModule),
    canActivate: [PsychologistGuard]
  },

  // RUTAS GENERALES (si necesitas restricción, añade AuthGuard aquí también)
  {
    path: 'weekly-schedule',
    loadChildren: () => import('./pages/weekly-schedule/weekly-schedule.module').then(m => m.WeeklySchedulePageModule)
  },
  {
    path: 'unauthorized',
    loadChildren: () => import('./pages/unauthorized/unauthorized.module').then( m => m.UnauthorizedPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }