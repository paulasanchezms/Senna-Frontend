import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PsychologistNavbarPage } from './psychologist-navbar.page';
import { AppointmentRequestsPage } from '../appointment-requests/appointment-requests.page';
import { CalendarPage } from '../calendar/calendar.page';
import { SearchPatientPage } from '../search-patient/search-patient.page';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: PsychologistNavbarPage,
    children: [
      {
        path: 'calendar',
        loadChildren: () => import('../calendar/calendar.module').then(m => m.CalendarPageModule),
      },
      {
        path: 'appointments',
        loadChildren: () => import('../appointment-requests/appointment-requests.module').then(m => m.AppointmentRequestsPageModule),
      },
      {
        path: 'search-patient',
        loadChildren: () => import('../search-patient/search-patient.module').then(m => m.SearchPatientPageModule),
      },
      { path: '', redirectTo: 'calendar', pathMatch: 'full' },
      { path: '**', redirectTo: 'calendar' }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PsychologistNavbarPageRoutingModule {}
