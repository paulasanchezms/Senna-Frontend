import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorkingHourModalPageRoutingModule } from './working-hour-modal-routing.module';

import { WorkingHourModalPage } from './working-hour-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WorkingHourModalPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [WorkingHourModalPage]
})
export class WorkingHourModalPageModule {}
