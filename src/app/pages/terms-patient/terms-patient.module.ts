import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TermsPatientPageRoutingModule } from './terms-patient-routing.module';

import { TermsPatientPage } from './terms-patient.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TermsPatientPageRoutingModule
  ],
  declarations: [TermsPatientPage]
})
export class TermsPatientPageModule {}
