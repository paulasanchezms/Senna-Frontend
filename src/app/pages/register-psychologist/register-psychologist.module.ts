import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterPsychologistPageRoutingModule } from './register-psychologist-routing.module';

import { RegisterPsychologistPage } from './register-psychologist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterPsychologistPageRoutingModule
  ],
  declarations: [RegisterPsychologistPage]
})
export class RegisterPsychologistPageModule {}
