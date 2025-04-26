import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterPsychologistPage } from './register-psychologist.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterPsychologistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterPsychologistPageRoutingModule {}
