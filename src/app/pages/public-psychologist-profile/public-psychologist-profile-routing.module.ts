import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PublicPsychologistProfilePage } from './public-psychologist-profile.page';

const routes: Routes = [
  {
    path: '',
    component: PublicPsychologistProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicPsychologistProfilePageRoutingModule {}
