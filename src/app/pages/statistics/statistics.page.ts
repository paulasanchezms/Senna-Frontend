import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import {
  StatisticsService,
  StatisticsResponse,
} from 'src/app/services/statistics.service';
import { DiaryService } from 'src/app/services/diary.service';
import { ModalController } from '@ionic/angular';
import { RegisterDayModalPage } from '../register-day-modal/register-day-modal.page';
import { ChartConfiguration } from 'chart.js';
import { catchError, firstValueFrom, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { PublicRegisterModalPage } from '../public-register-modal/public-register-modal.page';

@Component({
  standalone: false,
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit {
  @ViewChild('weeklyChart', { static: true }) weeklyChart!: BaseChartDirective;
  @ViewChild('monthlyChart', { static: true })
  monthlyChart!: BaseChartDirective;

  displayWeekYear!: number;
  displayWeekNum!: number;
  displayMonthYear!: number;
  displayMonth!: number;
  showWeekPicker = false;
  showMonthPicker = false;

  minWeekDate!: string;
  maxWeekDate!: string;
  minMonth!: string;
  maxMonth!: string;

  weekLabel = '';
  monthLabel = '';
  isCurrentWeek = false;
  isCurrentMonth = false;

  viewingPatientId!: number;
  isPsychologist = false;

  weeklyChartConfig: ChartConfiguration<'line'> = {
    type: 'line',
    data: {
      labels: ['L', 'M', 'X', 'J', 'V', 'S', 'D'],
      datasets: [
        {
          label: 'Estado de ánimo semanal',
          data: [],
          borderColor: '#f17c63',
          backgroundColor: '#f7d8c8',
          fill: false,
          spanGaps: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 20, bottom: 20 } },
      clip: false,
      scales: {
        y: {
          suggestedMin: 0.5,
          suggestedMax: 5.5,
          min: 1,
          max: 5,
          ticks: {
            stepSize: 1,
            padding: 15,
            callback: (v) =>
              ['Muy mal', 'Mal', 'Normal', 'Bien', 'Muy bien'][
                (v as number) - 1
              ],
          },
        },
        x: {
          ticks: { padding: 10 },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            title: (items) => `Día: ${items[0].label}`,
          },
        },
      },
      elements: {
        line: { tension: 0 },
        point: {
          radius: (ctx) =>
            ctx.chart.data.datasets[0].data.filter((d) => d !== null).length > 1
              ? 3
              : 6,
        },
      },
    },
  };

  monthlyChartConfig: ChartConfiguration<'line'> = {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Estado de ánimo mensual',
          data: [],
          borderColor: '#c4a2e2',
          backgroundColor: '#c7e2c3',
          fill: false,
          spanGaps: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 20, bottom: 20 } },
      clip: false,
      scales: {
        y: {
          suggestedMin: 0.5,
          suggestedMax: 5.5,
          min: 1,
          max: 5,
          ticks: {
            stepSize: 1,
            padding: 15,
            callback: (v) =>
              ['Muy mal', 'Mal', 'Normal', 'Bien', 'Muy bien'][
                (v as number) - 1
              ],
          },
        },
        x: {
          title: { display: true, text: 'Días' },
          ticks: { padding: 10 },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            title: (items) => `Día: ${items[0].label}`,
          },
        },
      },
      elements: {
        line: { tension: 0 },
        point: {
          radius: (ctx) =>
            ctx.chart.data.datasets[0].data.filter((d) => d !== null).length > 1
              ? 3
              : 6,
        },
      },
    },
  };

  constructor(
    private statisticsService: StatisticsService,
    private diaryService: DiaryService,
    private modalController: ModalController,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      alert('No se pudo identificar al usuario.');
      return;
    }

    this.isPsychologist = currentUser.role === 'PSYCHOLOGIST';

    if (this.isPsychologist) {
      const idFromRoute = this.route.snapshot.queryParamMap.get('patientId');
      if (!idFromRoute) {
        alert('No se proporcionó ID de paciente.');
        return;
      }
      this.viewingPatientId = +idFromRoute;
    } else {
      this.viewingPatientId = currentUser.id_user;
    }
    const today = new Date();
    const lastYear = new Date(today);
    lastYear.setFullYear(lastYear.getFullYear() - 1);

    this.minWeekDate = lastYear.toISOString();
    this.maxWeekDate = today.toISOString();
    this.minMonth = lastYear.toISOString();
    this.maxMonth = today.toISOString();

    this.displayWeekYear = this.getISOWeekYear(today);
    this.displayWeekNum = this.getISOWeekNumber(today);
    this.displayMonthYear = today.getFullYear();
    this.displayMonth = today.getMonth();

    this.updateWeekLabel();
    this.updateMonthLabel();

    this.loadWeeklyStatistics();
    this.loadMonthlyStatistics();
  }

  onWeekDateChange(val: string | string[] | null | undefined): void {
    if (!val || Array.isArray(val)) return;
    const d = new Date(val);
    this.displayWeekYear = this.getISOWeekYear(d);
    this.displayWeekNum = this.getISOWeekNumber(d);
    this.updateWeekLabel();
    this.loadWeeklyStatistics();
  }

  onMonthPickerChange(val: string | string[] | null | undefined): void {
    if (!val || Array.isArray(val)) return;
    const d = new Date(val);
    this.displayMonthYear = d.getFullYear();
    this.displayMonth = d.getMonth();
    this.updateMonthLabel();
    this.loadMonthlyStatistics();
  }

  prevWeek(): void {
    this.displayWeekNum--;
    if (this.displayWeekNum < 1) {
      this.displayWeekYear--;
      this.displayWeekNum = this.weeksInYear(this.displayWeekYear);
    }
    this.updateWeekLabel();
    this.loadWeeklyStatistics();
  }

  nextWeek(): void {
    this.displayWeekNum++;
    if (this.displayWeekNum > this.weeksInYear(this.displayWeekYear)) {
      this.displayWeekYear++;
      this.displayWeekNum = 1;
    }
    this.updateWeekLabel();
    this.loadWeeklyStatistics();
  }

  prevMonth(): void {
    this.displayMonth--;
    if (this.displayMonth < 0) {
      this.displayMonthYear--;
      this.displayMonth = 11;
    }
    this.updateMonthLabel();
    this.loadMonthlyStatistics();
  }

  nextMonth(): void {
    this.displayMonth++;
    if (this.displayMonth > 11) {
      this.displayMonthYear++;
      this.displayMonth = 0;
    }
    this.updateMonthLabel();
    this.loadMonthlyStatistics();
  }

  loadWeeklyStatistics(): void {
    const patientId = this.isPsychologist ? this.viewingPatientId : undefined;

    this.statisticsService
      .getWeeklyStatistics(this.displayWeekYear, this.displayWeekNum, patientId)
      .subscribe((data: StatisticsResponse) => {
        const raw = data.weeklyMoodLevels.map((l) => (l > 0 ? l : null));
        const newData = raw.every((v) => v === null) ? [] : raw;

        this.weeklyChartConfig = {
          ...this.weeklyChartConfig,
          data: {
            labels: ['L', 'M', 'X', 'J', 'V', 'S', 'D'],
            datasets: [
              {
                ...this.weeklyChartConfig.data.datasets[0],
                data: newData,
              },
            ],
          },
        };

        setTimeout(() => this.weeklyChart?.update(), 0);
      });
  }

  loadMonthlyStatistics(): void {
    const lastDay = new Date(
      this.displayMonthYear,
      this.displayMonth + 1,
      0
    ).getDate();
    const labels = Array.from({ length: lastDay }, (_, i) => `${i + 1}`);
    const patientId = this.isPsychologist ? this.viewingPatientId : undefined;

    this.statisticsService
      .getMonthlyStatistics(
        this.displayMonthYear,
        this.displayMonth + 1,
        patientId
      )
      .subscribe((data: StatisticsResponse) => {
        const raw = data.monthlyMoodLevels.map((l) => (l > 0 ? l : null));
        const newData = raw.every((v) => v === null) ? [] : raw;

        this.monthlyChartConfig = {
          ...this.monthlyChartConfig,
          data: {
            labels,
            datasets: [
              {
                ...this.monthlyChartConfig.data.datasets[0],
                data: newData,
              },
            ],
          },
        };

        setTimeout(() => this.monthlyChart?.update(), 0);
      });
  }

  async onChartClick(event: any, type: 'weekly' | 'monthly'): Promise<void> {
    const active = event.active;
    if (!active?.length) return;

    const idx = active[0].index;
    let sel: Date;

    if (type === 'weekly') {
      const m = this.getDateOfISOWeek(
        this.displayWeekNum,
        this.displayWeekYear
      );
      sel = new Date(m);
      sel.setDate(m.getDate() + idx);
    } else {
      sel = new Date(this.displayMonthYear, this.displayMonth, idx + 1);
    }

    const f = this.formatDate(sel);

    // 🔁 Diferenciar si el usuario es psicólogo o paciente
    const currentUser = this.authService.getCurrentUser();
    let existing = null;

    try {
      if (currentUser?.role === 'PSYCHOLOGIST') {
        existing = await firstValueFrom(
          this.diaryService
            .getEntryForPatientByDate(this.viewingPatientId, f)
            .pipe(catchError(() => of(null)))
        );
      } else {
        existing = await firstValueFrom(
          this.diaryService.getEntryByDate(f).pipe(catchError(() => of(null)))
        );
      }
    } catch (e) {
      console.error('Error al cargar entrada existente:', e);
    }

    const modal = await this.modalController.create({
      component:
        currentUser?.role === 'PSYCHOLOGIST'
          ? PublicRegisterModalPage
          : RegisterDayModalPage,
      componentProps:
        currentUser?.role === 'PSYCHOLOGIST'
          ? {
              selectedDate: f,
              patientId: this.viewingPatientId,
            }
          : {
              selectedDate: f,
              existingEntry: existing || null,
            },
    });

    await modal.present();
  }

  private getISOWeekNumber(d: Date): number {
    const tmp = new Date(d.valueOf());
    tmp.setHours(0, 0, 0, 0);
    tmp.setDate(tmp.getDate() + 3 - ((tmp.getDay() + 6) % 7));
    const week1 = new Date(tmp.getFullYear(), 0, 4);
    return (
      1 +
      Math.round(
        ((tmp.getTime() - week1.getTime()) / 86400000 -
          3 +
          ((week1.getDay() + 6) % 7)) /
          7
      )
    );
  }

  private getISOWeekYear(d: Date): number {
    const tmp = new Date(d.valueOf());
    tmp.setDate(tmp.getDate() + 3 - ((tmp.getDay() + 6) % 7));
    return tmp.getFullYear();
  }

  private weeksInYear(y: number): number {
    return this.getISOWeekNumber(new Date(y, 11, 31));
  }

  private getDateOfISOWeek(w: number, y: number): Date {
    const s = new Date(y, 0, 1 + (w - 1) * 7);
    const dow = (s.getDay() + 6) % 7;
    s.setDate(s.getDate() - dow);
    return s;
  }

  private updateWeekLabel(): void {
    const a = this.getDateOfISOWeek(this.displayWeekNum, this.displayWeekYear),
      b = new Date(a);
    b.setDate(a.getDate() + 6);
    const opts = { day: 'numeric', month: 'long' } as const;
    this.weekLabel = `${a.toLocaleDateString(
      'es-ES',
      opts
    )} – ${b.toLocaleDateString('es-ES', opts)}`;
    const now = new Date();
    this.isCurrentWeek =
      this.displayWeekYear === this.getISOWeekYear(now) &&
      this.displayWeekNum === this.getISOWeekNumber(now);
  }

  private updateMonthLabel(): void {
    const dt = new Date(this.displayMonthYear, this.displayMonth);
    let m = dt.toLocaleDateString('es-ES', { month: 'long' });
    m = m.charAt(0).toUpperCase() + m.slice(1);
    this.monthLabel = `${m}, ${this.displayMonthYear}`;
    const now = new Date();
    this.isCurrentMonth =
      this.displayMonthYear === now.getFullYear() &&
      this.displayMonth === now.getMonth();
  }

  private formatDate(d: Date): string {
    const p = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  }
}
