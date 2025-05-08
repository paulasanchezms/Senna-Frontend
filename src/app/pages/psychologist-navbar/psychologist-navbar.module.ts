import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PsychologistNavbarPageRoutingModule } from './psychologist-navbar-routing.module';

import { PsychologistNavbarPage } from './psychologist-navbar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PsychologistNavbarPageRoutingModule
  ],
  declarations: [PsychologistNavbarPage]
})
export class PsychologistNavbarPageModule {}
