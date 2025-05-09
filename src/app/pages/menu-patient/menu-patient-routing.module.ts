import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuPatientPage } from './menu-patient.page';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: MenuPatientPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule),
      },
      {
        path: 'stats',
        loadChildren: () => import('../statistics/statistics.module').then(m => m.StatisticsPageModule),
      },
      {
        path: 'psychologists',
        loadChildren: () => import('../search-psychologist/search-psychologist.module').then(m => m.SearchPsychologistPageModule),
      },
      {
        path: 'appointments',
        loadChildren: () => import('../upcoming-appointments/upcoming-appointments.module').then(m => m.UpcomingAppointmentsPageModule),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPatientPageRoutingModule {}