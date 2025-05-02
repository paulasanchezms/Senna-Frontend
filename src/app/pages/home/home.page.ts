import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RegisterDayModalPage } from '../register-day-modal/register-day-modal.page';
import { DiaryService } from 'src/app/Services/diary.service';

@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  name: string = 'Usuario';
  today: Date = new Date();
  weekDays: Date[] = [];
  registeredDates: string[] = []; // formato: 'YYYY-MM-DD'
  selectedDay: Date = this.today;

  constructor(
    private modalController: ModalController,
    private diaryService: DiaryService
  ) {}

  ngOnInit(): void {
    this.loadRegisteredDays();
    this.generateWeek();
  }

  loadRegisteredDays(): void {
    this.diaryService.getAllEntries().subscribe({
      next: (entries) => {
        this.registeredDates = entries.map((e) => e.date);
        console.log('Fechas cargadas del backend:', this.registeredDates);
      },
      error: (err) => {
        console.error('Error cargando días registrados:', err);
      },
    });
  }

  generateWeek(): void {
    const start = new Date(this.today);
    const dayIndex = (start.getDay() + 6) % 7; // lunes = 0
    start.setDate(this.today.getDate() - dayIndex);

    this.weekDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }

  isToday(date: Date): boolean {
    return date.toDateString() === this.today.toDateString();
  }

  isFuture(date: Date): boolean {
    return date > this.today;
  }

  isRegistered(date: Date): boolean {
    const dateStr = date.toISOString().split('T')[0];
    return this.registeredDates.includes(dateStr);
  }

  canRegister(date: Date): boolean {
    return !this.isFuture(date);
  }

async openLogModal(date: Date): Promise<void> {
  const dateString = date.toISOString().split('T')[0];

  let existingEntry = null;
  if (this.isRegistered(date)) {
    existingEntry = await this.diaryService.getEntryByDate(dateString).toPromise();
  }

  const modal = await this.modalController.create({
    component: RegisterDayModalPage,
    componentProps: {
      selectedDate: dateString,
      existingEntry: existingEntry
    },
  });

  await modal.present();

  const { data, role } = await modal.onWillDismiss();
  if (role === 'confirm' && data) {
    if (!this.registeredDates.includes(data)) {
      this.registeredDates.push(data);
    }
  }
}

  selectDay(day: Date): void {
    if (!this.isFuture(day)) {
      this.selectedDay = day;
      console.log(`Día seleccionado: ${day.toDateString()}`);
    }
  }

  isSelected(date: Date): boolean {
    return this.selectedDay && this.selectedDay.toDateString() === date.toDateString();
  }
}