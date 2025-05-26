import { LOCALE_ID, NgModule } from '@angular/core';
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
  declarations: [ScheduleAppointmentPage],
  providers: [{ provide: LOCALE_ID, useValue: 'es-ES' }]
})
export class ScheduleAppointmentPageModule {}
