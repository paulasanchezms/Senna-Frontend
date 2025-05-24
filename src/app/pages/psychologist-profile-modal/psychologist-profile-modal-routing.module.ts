import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PsychologistProfileModalPage } from './psychologist-profile-modal.page';

const routes: Routes = [
  {
    path: '',
    component: PsychologistProfileModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PsychologistProfileModalPageRoutingModule {}
