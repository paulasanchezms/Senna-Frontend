import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmAppointmentPageRoutingModule } from './confirm-appointment-routing.module';

import { ConfirmAppointmentPage } from './confirm-appointment.page';
import { PsychologistNavbarPageModule } from '../psychologist-navbar/psychologist-navbar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmAppointmentPageRoutingModule,
    PsychologistNavbarPageModule

  ],
  declarations: [ConfirmAppointmentPage]
})
export class ConfirmAppointmentPageModule {}
