import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchPatientPageRoutingModule } from './search-patient-routing.module';

import { SearchPatientPage } from './search-patient.page';
import { PsychologistNavbarPage } from '../psychologist-navbar/psychologist-navbar.page';
import { PsychologistNavbarPageModule } from '../psychologist-navbar/psychologist-navbar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchPatientPageRoutingModule,
    PsychologistNavbarPageModule
  ],
  declarations: [SearchPatientPage]
})
export class SearchPatientPageModule {}
