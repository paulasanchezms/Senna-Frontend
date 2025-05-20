// public-psychologist-profile.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { PublicPsychologistProfilePage } from './public-psychologist-profile.page';

const routes: Routes = [
  {
    path: '',
    component: PublicPsychologistProfilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PublicPsychologistProfilePage]
})
export class PublicPsychologistProfilePageModule {}
