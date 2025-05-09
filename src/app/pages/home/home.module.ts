import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { RegisterDayModalPage } from '../register-day-modal/register-day-modal.page';
import { RegisterDayModalPageModule } from '../register-day-modal/register-day-modal.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    RegisterDayModalPageModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
