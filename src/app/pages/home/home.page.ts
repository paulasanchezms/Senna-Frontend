import { Component, OnInit } from '@angular/core';

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
  selectedDay: Date = this.today; // por defecto es hoy

  ngOnInit(): void {
    this.loadRegisteredDays();
    this.generateWeek();
  }

  loadRegisteredDays(): void {
    // ⚠ Aquí traerías del backend las fechas ya registradas
    // De momento mock:
    this.registeredDates = ['2025-04-29', '2025-04-30']; // días simulados registrados
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

  openLogModal(date: Date): void {
    console.log(`Abriendo registro para: ${date.toDateString()}`);
    // Aquí abrirías el modal o navegarías al formulario
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