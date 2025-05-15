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
  @Input() dayOfWeek!: number;

  days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  selectedDay = 0;
  workingHoursForDay: WorkingHourDTO[] = [];

  constructor(
    private whService: WorkingHourService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.selectedDay = this.dayOfWeek;
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
    for (const [index, hour] of this.workingHoursForDay.entries()) {
      if (!hour.startTime || !hour.endTime) {
        this.showToast(`Franja ${index + 1}: completa ambas horas.`);
        return;
      }
      if (hour.startTime >= hour.endTime) {
        this.showToast(`Franja ${index + 1}: la hora de inicio debe ser menor.`);
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
  
    // Normalizar el día para el backend: 1 (lunes) a 7 (domingo)
    const backendDay = this.selectedDay + 1;
  
    const dtos: WorkingHourDTO[] = this.workingHoursForDay.map(hour => ({
      dayOfWeek: backendDay,
      startTime: hour.startTime + ':00',
      endTime: hour.endTime + ':00'
    }));
  
    // Paso solo las franjas del día seleccionado al backend
    await this.whService.replaceWorkingHours(this.userId, dtos).toPromise();
  
    const updatedHours = await this.whService.getWorkingHours(this.userId).toPromise() ?? [];
    this.allHours = updatedHours;
    this.loadHoursForDay(this.selectedDay);
  
    this.modalCtrl.dismiss({ status: 'saved', updatedHours: this.allHours });
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