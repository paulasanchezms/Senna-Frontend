import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalendarPageRoutingModule } from './calendar-routing.module';

import { CalendarPage } from './calendar.page';
import { FullCalendarModule } from '@fullcalendar/angular';
import { PsychologistNavbarPageModule } from '../psychologist-navbar/psychologist-navbar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarPageRoutingModule,
    FullCalendarModule,
    PsychologistNavbarPageModule
  ],
  declarations: [CalendarPage]
})
export class CalendarPageModule {}
