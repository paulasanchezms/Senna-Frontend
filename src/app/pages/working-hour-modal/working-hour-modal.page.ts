import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { WorkingHourDTO } from '../../services/working-hour.service'; // solo para fallback
import { WorkingHourCustomDTO } from 'src/app/models/working-hour-custom';
import { WorkingHourCustomService } from 'src/app/services/working-hour-custom.service';

@Component({
  standalone: false,
  selector: 'app-working-hour-modal',
  templateUrl: './working-hour-modal.page.html',
  styleUrls: ['./working-hour-modal.page.scss'],
})
export class WorkingHourModalPage implements OnInit {
  @Input() userId!: number;
  @Input() allHours: WorkingHourDTO[] = [];
  @Input() selectedDate!: string; // YYYY-MM-DD
  @Input() dayOfWeek!: number; // 0-6 (lunes a domingo)

  days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  selectedDay = 0;
  workingHoursForDay: WorkingHourCustomDTO[] = [];

  constructor(
    private customWhService: WorkingHourCustomService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.selectedDay = this.dayOfWeek;
    this.loadHoursForDate(this.selectedDate);
  }

  loadHoursForDate(date: string) {
    this.customWhService.getCustomHours(this.userId, date).subscribe(customHours => {
      if (customHours.length > 0) {
        this.workingHoursForDay = customHours.map(h => ({
          startTime: h.startTime.slice(0, 5),
          endTime: h.endTime.slice(0, 5),
        }));
      } else {
        this.workingHoursForDay = this.allHours
          .filter(h => h.dayOfWeek === this.selectedDay)
          .map(h => ({
            startTime: h.startTime.slice(0, 5),
            endTime: h.endTime.slice(0, 5),
          }));
      }
    });
  }

  selectDay(index: number) {
    this.selectedDay = index;
  }

  addEmptyRow() {
    this.workingHoursForDay.push({
      startTime: '',
      endTime: ''
    });
  }

  async deleteHour(hour: WorkingHourCustomDTO) {
    this.workingHoursForDay = this.workingHoursForDay.filter(h => h !== hour);
  }

  async saveAll() {
    if (!this.selectedDate) return;

    for (const [i, hour] of this.workingHoursForDay.entries()) {
      if (!hour.startTime || !hour.endTime) {
        this.showToast(`Franja ${i + 1}: completa ambas horas.`);
        return;
      }
      if (hour.startTime >= hour.endTime) {
        this.showToast(`Franja ${i + 1}: hora de inicio debe ser menor.`);
        return;
      }
    }

    const sorted = [...this.workingHoursForDay].sort((a, b) => a.startTime.localeCompare(b.startTime));
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i].endTime > sorted[i + 1].startTime) {
        this.showToast(`Las franjas ${i + 1} y ${i + 2} se solapan.`);
        return;
      }
    }

    await this.customWhService
      .replaceCustomHours(this.userId, this.selectedDate, this.workingHoursForDay)
      .toPromise();

    this.modalCtrl.dismiss({ status: 'saved' });
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color: 'danger'
    });
    await toast.present();
  }

  close() {
    this.modalCtrl.dismiss({ status: 'cancelled' });
  }
}