import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { WorkingHourService, WorkingHourDTO } from '../../services/working-hour.service';

@Component({
  standalone: false,
  selector: 'app-working-hour-modal',
  templateUrl: './working-hour-modal.page.html',
  styleUrls: ['./working-hour-modal.page.scss'],
})
export class WorkingHourModalPage implements OnInit {
  @Input() userId!: number;
  @Input() allHours: WorkingHourDTO[] = [];

  days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  selectedDay = 0;
  workingHoursForDay: WorkingHourDTO[] = [];

  constructor(
    private whService: WorkingHourService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.loadHoursForDay(this.selectedDay);
  }

  loadHoursForDay(dayIndex: number) {
    this.workingHoursForDay = this.allHours
      .filter(wh => wh.dayOfWeek === dayIndex)
      .map(wh => ({
        ...wh,
        startTime: wh.startTime.slice(0, 5),
        endTime: wh.endTime.slice(0, 5)
      }));
  }

  selectDay(index: number) {
    this.selectedDay = index;
    this.loadHoursForDay(index);
  }

  addEmptyRow() {
    this.workingHoursForDay.push({
      dayOfWeek: this.selectedDay,
      startTime: '',
      endTime: ''
    });
  }

  async deleteHour(hour: WorkingHourDTO) {
    if ((hour as any).id) {
      await this.whService.deleteWorkingHour(this.userId, (hour as any).id).toPromise();
    }
    this.workingHoursForDay = this.workingHoursForDay.filter(h => h !== hour);
  }

  async saveAll() {
    // VALIDACIONES
    for (const [index, hour] of this.workingHoursForDay.entries()) {
      if (!hour.startTime || !hour.endTime) {
        this.showToast(`Franja ${index + 1}: Por favor completa ambas horas.`);
        return;
      }

      if (hour.startTime >= hour.endTime) {
        this.showToast(`Franja ${index + 1}: La hora de inicio debe ser anterior a la de fin.`);
        return;
      }
    }

    // OPCIONAL: comprobar solapamientos
    const sorted = [...this.workingHoursForDay].sort((a, b) => a.startTime.localeCompare(b.startTime));
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i].endTime > sorted[i + 1].startTime) {
        this.showToast(`Las franjas ${i + 1} y ${i + 2} se solapan.`);
        return;
      }
    }

    // SI TODO OK -> guardar
    for (const hour of this.workingHoursForDay) {
      const dto: WorkingHourDTO = {
        dayOfWeek: this.selectedDay,
        startTime: hour.startTime + ':00',
        endTime: hour.endTime + ':00'
      };

      if ((hour as any).id) {
        await this.whService.updateWorkingHour(this.userId, (hour as any).id, dto).toPromise();
      } else {
        await this.whService.createWorkingHour(this.userId, dto).toPromise();
      }
    }

    const updatedHours = await this.whService.getWorkingHours(this.userId).toPromise() ?? [];
    this.allHours = updatedHours;
    this.loadHoursForDay(this.selectedDay);

    this.modalCtrl.dismiss('saved');
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
    this.modalCtrl.dismiss('cancelled');
  }
}