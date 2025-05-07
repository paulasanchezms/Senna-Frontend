import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  days: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  selectedDay = 0;

  workingHoursForDay: WorkingHourDTO[] = [];
  hourForm!: FormGroup;
  editingHourId?: number;

  constructor(
    private fb: FormBuilder,
    private whService: WorkingHourService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.buildForm();
    this.loadHoursForDay(this.selectedDay);
  }

  buildForm() {
    this.hourForm = this.fb.group({
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    });
  }

  loadHoursForDay(dayIndex: number) {
    this.workingHoursForDay = this.allHours.filter(wh => wh.dayOfWeek === dayIndex);
    this.hourForm.reset();
    this.editingHourId = undefined;
  }

  selectDay(index: number) {
    this.selectedDay = index;
    this.loadHoursForDay(index);
  }

  edit(hour: WorkingHourDTO) {
    this.hourForm.patchValue({
      startTime: hour.startTime.slice(0, 5),
      endTime: hour.endTime.slice(0, 5)
    });
    this.editingHourId = (hour as any).id;
  }

  async save() {
    if (this.hourForm.invalid) return;

    const dto: WorkingHourDTO = {
      dayOfWeek: this.selectedDay,
      startTime: this.hourForm.value.startTime + ':00',
      endTime: this.hourForm.value.endTime + ':00'
    };

    if (this.editingHourId) {
      await this.whService.updateWorkingHour(this.userId, this.editingHourId, dto).toPromise();
    } else {
      await this.whService.createWorkingHour(this.userId, dto).toPromise();
    }

    const updatedHours = await this.whService.getWorkingHours(this.userId).toPromise() ?? [];
    this.allHours = updatedHours;
    this.loadHoursForDay(this.selectedDay);

    this.hourForm.reset();
    this.editingHourId = undefined;
  }

  async delete(hourId: number) {
    await this.whService.deleteWorkingHour(this.userId, hourId).toPromise();
    const updatedHours = await this.whService.getWorkingHours(this.userId).toPromise() ?? [];
    this.allHours = updatedHours;
    this.loadHoursForDay(this.selectedDay);
  }

  close() {
    this.modalCtrl.dismiss('saved');
  }

  // Igual que tenías pero añade esta función:

async deleteHourByTime(hour: WorkingHourDTO) {
  const existing = this.allHours.find(h => 
    h.dayOfWeek === hour.dayOfWeek &&
    h.startTime === hour.startTime &&
    h.endTime === hour.endTime
  );
  if (existing && (existing as any).id) {
    await this.whService.deleteWorkingHour(this.userId, (existing as any).id).toPromise();
    const updatedHours = await this.whService.getWorkingHours(this.userId).toPromise() ?? [];
    this.allHours = updatedHours;
    this.loadHoursForDay(this.selectedDay);
  }
}
}