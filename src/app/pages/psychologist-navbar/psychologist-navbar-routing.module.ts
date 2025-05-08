import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PsychologistNavbarPage } from './psychologist-navbar.page';

const routes: Routes = [
  {
    path: '',
    component: PsychologistNavbarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PsychologistNavbarPageRoutingModule {}
