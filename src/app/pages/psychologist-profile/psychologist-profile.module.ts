import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PsychologistProfilePageRoutingModule } from './psychologist-profile-routing.module';

import { PsychologistProfilePage } from './psychologist-profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    PsychologistProfilePageRoutingModule
  ],
  declarations: [PsychologistProfilePage]
})
export class PsychologistProfilePageModule {}
