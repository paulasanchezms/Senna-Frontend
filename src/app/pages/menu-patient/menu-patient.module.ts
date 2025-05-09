import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuPatientPageRoutingModule } from './menu-patient-routing.module';

import { MenuPatientPage } from './menu-patient.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuPatientPageRoutingModule
  ],
  declarations: [MenuPatientPage]
})
export class MenuPatientPageModule {}
