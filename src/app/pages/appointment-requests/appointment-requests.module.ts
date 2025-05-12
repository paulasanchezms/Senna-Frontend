import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppointmentRequestsPageRoutingModule } from './appointment-requests-routing.module';

import { AppointmentRequestsPage } from './appointment-requests.page';
import { PsychologistNavbarPageModule } from '../psychologist-navbar/psychologist-navbar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppointmentRequestsPageRoutingModule,
    PsychologistNavbarPageModule
  ],
  declarations: [AppointmentRequestsPage]
})
export class AppointmentRequestsPageModule {}
