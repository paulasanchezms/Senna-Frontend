import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScheduleAppointmentPageRoutingModule } from './schedule-appointment-routing.module';

import { ScheduleAppointmentPage } from './schedule-appointment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScheduleAppointmentPageRoutingModule
  ],
  declarations: [ScheduleAppointmentPage]
})
export class ScheduleAppointmentPageModule {}
