import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { StatisticsService } from 'src/app/services/statistics.service';
import { ChartConfiguration } from 'chart.js';

@Component({
  standalone: false,
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit {
  @ViewChild('weeklyChart') weeklyChart!: BaseChartDirective;
  @ViewChild('monthlyChart') monthlyChart!: BaseChartDirective;

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
      scales: {
        y: {
          min: 1,
          max: 5,
          ticks: {
            stepSize: 1,
            callback: (value) => {
              const labels = ['Muy mal', 'Mal', 'Normal', 'Bien', 'Muy bien'];
              return labels[(value as number) - 1];
            },
          },
        },
        x: {
          title: { display: true, text: 'Días' },
          ticks: { display: false },
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
        line: {
          tension: 0,
        },
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
      labels: Array.from({ length: 31 }, (_, i) => `${i + 1}`),
      datasets: [
        {
          label: 'Estado de ánimo mensual',
          data: [],
          borderColor: '#c4a2e2',
          backgroundColor: '#c7e2c3',
          fill: false,
          spanGaps: false,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          min: 1,
          max: 5,
          ticks: {
            stepSize: 1,
            callback: (value) => {
              const labels = ['Muy mal', 'Mal', 'Normal', 'Bien', 'Muy bien'];
              return labels[(value as number) - 1];
            },
          },
        },
        x: {
          title: { display: true, text: 'Días' },
          ticks: { display: false },
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
        line: {
          tension: 0.3,
        },
        point: {
          radius: (ctx) =>
            ctx.chart.data.datasets[0].data.filter((d) => d !== null).length > 1
              ? 3
              : 6,
        },
      },
    },
  };

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.loadWeeklyStatistics();
    this.loadMonthlyStatistics();
  }

  loadWeeklyStatistics(): void {
    this.statisticsService.getWeeklyStatistics().subscribe((data) => {
      this.weeklyChartConfig.data.datasets[0].data = data.weeklyMoodLevels.map(
        (level) => (level > 0 ? level : null)
      );
      if (this.weeklyChart && this.weeklyChart.chart) {
        this.weeklyChart.chart.update();
      }
    });
  }

  loadMonthlyStatistics(): void {
    this.statisticsService.getMonthlyStatistics().subscribe((data) => {
      this.monthlyChartConfig.data.datasets[0].data = data.monthlyMoodLevels.map(
        (level) => (level > 0 ? level : null)
      );
      if (this.monthlyChart && this.monthlyChart.chart) {
        this.monthlyChart.chart.update();
      }
    });
  }
}