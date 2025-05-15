import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PatientTabsPage } from './patient-tabs.page';

const routes: Routes = [
  {
    path: '',
    component: PatientTabsPage,
    children: [
      { path: 'home', loadChildren: () => import('../home/home.module').then(m => m.HomePageModule) },
      { path: 'statistics', loadChildren: () => import('../statistics/statistics.module').then(m => m.StatisticsPageModule) },
      { path: 'search-psychologist', loadChildren: () => import('../search-psychologist/search-psychologist.module').then(m => m.SearchPsychologistPageModule) },
      { path: 'upcoming-appointments', loadChildren: () => import('../upcoming-appointments/upcoming-appointments.module').then(m => m.UpcomingAppointmentsPageModule) },
      {path:'patient-profile', loadChildren: () => import('../patient-profile/patient-profile.module').then(m => m.PatientProfilePageModule)},
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientTabsPageRoutingModule {}
