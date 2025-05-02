import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterDayModalPage } from './register-day-modal.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterDayModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterDayModalPageRoutingModule {}
