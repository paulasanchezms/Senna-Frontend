import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchPsychologistPageRoutingModule } from './search-psychologist-routing.module';

import { SearchPsychologistPage } from './search-psychologist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchPsychologistPageRoutingModule
  ],
  declarations: [SearchPsychologistPage]
})
export class SearchPsychologistPageModule {}
