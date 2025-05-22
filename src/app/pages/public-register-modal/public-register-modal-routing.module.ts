import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PublicRegisterModalPage } from './public-register-modal.page';

const routes: Routes = [
  {
    path: '',
    component: PublicRegisterModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicRegisterModalPageRoutingModule {}
