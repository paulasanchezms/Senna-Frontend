import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TermsPsychologistPageRoutingModule } from './terms-psychologist-routing.module';

import { TermsPsychologistPage } from './terms-psychologist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TermsPsychologistPageRoutingModule
  ],
  declarations: [TermsPsychologistPage]
})
export class TermsPsychologistPageModule {}
