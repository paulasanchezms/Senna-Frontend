import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PublicPatientProfilePage } from './public-patient-profile.page';

const routes: Routes = [
  {
    path: '',
    component: PublicPatientProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicPatientProfilePageRoutingModule {}
