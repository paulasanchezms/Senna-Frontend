import { Component, OnInit } from '@angular/core';

@Component({
  standalone:false,
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  name: string = 'Lily'; // luego puedes traerlo del token
  today: Date = new Date();
  weekDays: Date[] = [];

  ngOnInit(): void {
    this.generateWeek();
  }

  generateWeek(): void {
    const start = new Date(this.today);
    const dayIndex = start.getDay(); // 0 (domingo) a 6 (sábado)
    start.setDate(this.today.getDate() - dayIndex); // primer día de la semana (domingo)

    this.weekDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }

  isToday(date: Date): boolean {
    const todayStr = this.today.toDateString();
    const dateStr = date.toDateString();
    return todayStr === dateStr;
  }

  openLogModal(): void {
    console.log("Abriendo modal para registrar");
  }
}