import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkingHourModalPage } from './working-hour-modal.page';

const routes: Routes = [
  {
    path: '',
    component: WorkingHourModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkingHourModalPageRoutingModule {}
