import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { StatisticsService } from 'src/app/services/statistics.service';
import { DiaryService } from 'src/app/services/diary.service';
import { ModalController } from '@ionic/angular';
import { RegisterDayModalPage } from '../register-day-modal/register-day-modal.page';
import { ChartConfiguration } from 'chart.js';
import { catchError, of, firstValueFrom } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit {
  @ViewChild('weeklyChart') weeklyChart!: BaseChartDirective;
  @ViewChild('monthlyChart') monthlyChart!: BaseChartDirective;

  currentChartYear!: number;
  currentChartMonth!: number;

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
      layout: {
        padding: {
          top: 20,
          bottom: 20,
        },
      },
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
            callback: (value) => {
              const labels = ['Muy mal', 'Mal', 'Normal', 'Bien', 'Muy bien'];
              return labels[(value as number) - 1];
            },
          },
        },
        x: {
          title: { display: true, text: 'Días' },
          ticks: {
            padding: 10,
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            title: (tooltipItems) => {
              const item = tooltipItems[0];
              return `Día: ${item.label}`;
            },
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
      layout: {
        padding: { top: 20, bottom: 20 },
      },
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
            callback: (value) => {
              const labels = ['Muy mal', 'Mal', 'Normal', 'Bien', 'Muy bien'];
              return labels[(value as number) - 1];
            },
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
            title: (tooltipItems) => {
              const item = tooltipItems[0];
              return `Día: ${item.label}`;
            },
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
    private modalController: ModalController
  ) {}

  ngOnInit(): void {
    this.loadWeeklyStatistics();
    this.loadMonthlyStatistics();
  }

  loadWeeklyStatistics(): void {
    this.statisticsService.getWeeklyStatistics().subscribe((data) => {
      this.weeklyChartConfig.data.datasets[0].data = data.weeklyMoodLevels.map(
        (level) => (level > 0 ? level : null)
      );
      this.weeklyChart?.chart?.update();
    });
  }

  loadMonthlyStatistics(): void {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();

    this.currentChartYear = year;
    this.currentChartMonth = month;

    this.statisticsService.getMonthlyStatistics().subscribe((data) => {
      this.monthlyChartConfig.data.labels = Array.from(
        { length: lastDay },
        (_, i) => `${i + 1}`
      );

      if (data.monthlyMoodLevels.length === lastDay) {
        this.monthlyChartConfig.data.datasets[0].data =
          data.monthlyMoodLevels.map((level) => (level > 0 ? level : null));
      } else {
        console.warn('Mismatch in monthlyMoodLevels length, skipping update');
        this.monthlyChartConfig.data.datasets[0].data = [];
      }

      this.monthlyChart?.chart?.update();
    });
  }

  async onChartClick(event: any, type: 'weekly' | 'monthly'): Promise<void> {
    const activePoints = event.active;
    if (!activePoints?.length) {
      return;
    }

    const chartElement = activePoints[0];
    const index = chartElement.index;
    const today = new Date();
    let selectedDate: Date;

    if (type === 'weekly') {
      // Lunes de la semana
      const monday = new Date(today);
      monday.setDate(today.getDate() - today.getDay() + 1);
      selectedDate = new Date(monday);
      selectedDate.setDate(monday.getDate() + index);
    } else {
      // Día del mes (index + 1)
      const dayNumber = index + 1;
      selectedDate = new Date(
        this.currentChartYear,
        this.currentChartMonth,
        dayNumber
      );
    }

    // Formateo en local para evitar desfase UTC
    const formattedDate = this.formatDate(selectedDate);

    const existingEntry = await firstValueFrom(
      this.diaryService
        .getEntryByDate(formattedDate)
        .pipe(catchError(() => of(null)))
    );

    const modal = await this.modalController.create({
      component: RegisterDayModalPage,
      componentProps: {
        selectedDate: formattedDate,
        existingEntry: existingEntry || null,
      },
    });
    await modal.present();
  }

  private formatDate(date: Date): string {
    const pad = (n: number) => (n < 10 ? '0' + n : n.toString());
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    return `${year}-${month}-${day}`;
  }
}