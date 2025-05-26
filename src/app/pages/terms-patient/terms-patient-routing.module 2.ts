import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TermsPatientPage } from './terms-patient.page';

const routes: Routes = [
  {
    path: '',
    component: TermsPatientPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TermsPatientPageRoutingModule {}
