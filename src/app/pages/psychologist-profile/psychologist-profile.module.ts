import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PsychologistProfilePageRoutingModule } from './psychologist-profile-routing.module';

import { PsychologistProfilePage } from './psychologist-profile.page';
import { PsychologistNavbarPageModule } from '../psychologist-navbar/psychologist-navbar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    PsychologistProfilePageRoutingModule,
    PsychologistNavbarPageModule
  ],
  declarations: [PsychologistProfilePage]
})
export class PsychologistProfilePageModule {}
