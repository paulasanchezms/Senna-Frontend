import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PatientTabsPageRoutingModule } from './patient-tabs-routing.module';

import { PatientTabsPage } from './patient-tabs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PatientTabsPageRoutingModule
  ],
  declarations: [PatientTabsPage]
})
export class PatientTabsPageModule {}
