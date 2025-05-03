import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterDayModalPageRoutingModule } from './register-day-modal-routing.module';

import { RegisterDayModalPage } from './register-day-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterDayModalPageRoutingModule
  ],
  declarations: [RegisterDayModalPage]
})
export class RegisterDayModalPageModule {}
