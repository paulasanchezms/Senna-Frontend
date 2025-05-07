import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkingHourService } from '../../services/working-hour.service';
import { WorkingHour } from '../../models/working-hour';

@Component({
  standalone:false,
  selector: 'app-working-hour-modal',
  templateUrl: './working-hour-modal.page.html',
  styleUrls: ['./working-hour-modal.page.scss'],
})
export class WorkingHourModalPage implements OnInit {
  @Input() userId!: number;
  @Input() dayOfWeek!: number;
  @Input() workingHour?: WorkingHour;

  hourForm!: FormGroup;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private whService: WorkingHourService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.isEdit = !!this.workingHour;
    this.hourForm = this.fb.group({
      dayOfWeek: [this.dayOfWeek],
      startTime: [this.workingHour?.startTime || '', Validators.required],
      endTime:   [this.workingHour?.endTime   || '', Validators.required],
    });
  }

  async save() {
    if (this.hourForm.invalid) return;
    const dto = this.hourForm.value as WorkingHour;
    if (this.isEdit && this.workingHour) {
      await this.whService.updateWorkingHour(
        this.userId,
        (this.workingHour as any).id,
        dto
      ).toPromise();
    } else {
      await this.whService.createWorkingHour(this.userId, dto).toPromise();
    }
    this.modalCtrl.dismiss('saved');
  }

  delete() {
    if (this.isEdit && this.workingHour) {
      this.whService.deleteWorkingHour(
        this.userId,
        (this.workingHour as any).id
      ).subscribe(() => this.modalCtrl.dismiss('deleted'));
    } else {
      this.modalCtrl.dismiss();
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
