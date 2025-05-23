import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PsychologistProfileModalPageRoutingModule } from './psychologist-profile-modal-routing.module';

import { PsychologistProfileModalPage } from './psychologist-profile-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PsychologistProfileModalPageRoutingModule
  ],
  declarations: [PsychologistProfileModalPage]
})
export class PsychologistProfileModalPageModule {}
