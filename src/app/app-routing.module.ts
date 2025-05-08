import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    canActivate:[AuthGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register/psychologist',
    loadChildren: () => import('./pages/register-psychologist/register-psychologist.module').then( m => m.RegisterPsychologistPageModule)
  },
  {
    path: 'register-day-modal',
    loadChildren: () => import('./pages/register-day-modal/register-day-modal.module').then( m => m.RegisterDayModalPageModule)
  },
  {
    path: 'statistics',
    loadChildren: () => import('./pages/statistics/statistics.module').then( m => m.StatisticsPageModule)
  },
  {
    path: 'schedule-appointment/:id',
    loadChildren: () => import('./pages/schedule-appointment/schedule-appointment.module')
                     .then(m => m.ScheduleAppointmentPageModule)
  },
  {
    path: 'search-psychologist',
    loadChildren: () => import('./pages/search-psychologist/search-psychologist.module').then( m => m.SearchPsychologistPageModule)
  },
  {
    path: 'confirm-appointment',
    loadChildren: () => import('./pages/confirm-appointment/confirm-appointment.module').then( m => m.ConfirmAppointmentPageModule)
  },
  {
    path: 'weekly-schedule',
    loadChildren: () => import('./pages/weekly-schedule/weekly-schedule.module').then( m => m.WeeklySchedulePageModule)
  },
  {
    path: 'working-hour-modal',
    loadChildren: () => import('./pages/working-hour-modal/working-hour-modal.module').then( m => m.WorkingHourModalPageModule)
  },
  {
    path: 'calendar',
    loadChildren: () => import('./pages/calendar/calendar.module').then( m => m.CalendarPageModule)
  },
  {
    path: 'appointment-requests',
    loadChildren: () => import('./pages/appointment-requests/appointment-requests.module').then( m => m.AppointmentRequestsPageModule)
  },
  {
    path: 'psychologist-navbar',
    loadChildren: () => import('./pages/psychologist-navbar/psychologist-navbar.module').then( m => m.PsychologistNavbarPageModule)
  },
  {
    path: 'search-patient',
    loadChildren: () => import('./pages/search-patient/search-patient.module').then( m => m.SearchPatientPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
