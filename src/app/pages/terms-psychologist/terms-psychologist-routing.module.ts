import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TermsPsychologistPage } from './terms-psychologist.page';

const routes: Routes = [
  {
    path: '',
    component: TermsPsychologistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TermsPsychologistPageRoutingModule {}
