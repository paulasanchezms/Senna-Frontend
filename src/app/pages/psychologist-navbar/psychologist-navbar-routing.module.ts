import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PsychologistNavbarPage } from './psychologist-navbar.page';
import { AppointmentRequestsPage } from '../appointment-requests/appointment-requests.page';
import { CalendarPage } from '../calendar/calendar.page';
import { SearchPatientPage } from '../search-patient/search-patient.page';
import { PsychologistProfilePage } from '../psychologist-profile/psychologist-profile.page';

const routes: Routes = [
  { path: 'calendar', component: CalendarPage },
  { path: 'appointments', component: AppointmentRequestsPage },
  {
    path: 'search-patient',component: SearchPatientPage
  },
  {
    path: 'psychologist-profile',component: PsychologistProfilePage},
  { path: '', redirectTo: 'calendar', pathMatch: 'full' },
  { path: '**', redirectTo: 'calendar' }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PsychologistNavbarPageRoutingModule {}
