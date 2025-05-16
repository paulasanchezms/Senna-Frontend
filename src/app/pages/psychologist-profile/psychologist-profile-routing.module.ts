import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PsychologistProfilePage } from './psychologist-profile.page';

const routes: Routes = [
  {
    path: '',
    component: PsychologistProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PsychologistProfilePageRoutingModule {}
