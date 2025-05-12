import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WeeklySchedulePageRoutingModule } from './weekly-schedule-routing.module';

import { WeeklySchedulePage } from './weekly-schedule.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WeeklySchedulePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [WeeklySchedulePage]
})
export class WeeklySchedulePageModule {}
