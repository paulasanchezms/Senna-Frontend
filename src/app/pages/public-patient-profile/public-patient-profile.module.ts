import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PublicPatientProfilePageRoutingModule } from './public-patient-profile-routing.module';

import { PublicPatientProfilePage } from './public-patient-profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PublicPatientProfilePageRoutingModule
  ],
  declarations: [PublicPatientProfilePage]
})
export class PublicPatientProfilePageModule {}
