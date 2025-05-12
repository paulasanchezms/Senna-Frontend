import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WeeklySchedulePage } from './weekly-schedule.page';

const routes: Routes = [
  {
    path: '',
    component: WeeklySchedulePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WeeklySchedulePageRoutingModule {}
