import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchPsychologistPage } from './search-psychologist.page';

const routes: Routes = [
  {
    path: '',
    component: SearchPsychologistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchPsychologistPageRoutingModule {}
