import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { WorkingHourService, WorkingHourDTO } from '../../services/working-hour.service';
import { PsychologistProfileService } from '../../services/psychologist-profile.service';
import { UserService } from '../../services/user.service';
import { UserResponseDTO } from '../../models/user';
import { firstValueFrom } from 'rxjs';


@Component({
  standalone:false,
  selector: 'app-weekly-schedule',
  templateUrl: './weekly-schedule.page.html',
  styleUrls: ['./weekly-schedule.page.scss'],
})
export class WeeklySchedulePage implements OnInit {
  days = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

  scheduleForm!: FormGroup;
  consultationDuration!: number;
  private userId!: number;

  constructor(
    private fb: FormBuilder,
    private whService: WorkingHourService,
    private profileService: PsychologistProfileService,
    private userService: UserService
  ) {}

  ngOnInit() {
    // 1) Crear el formulario *antes* de cualquier suscripción
    this.buildForm();

    // 2) Obtener userId y luego cargar perfil y franjas
    this.userService.me().subscribe({
      next: (user: UserResponseDTO) => {
        this.userId = user.id_user;
        this.loadProfileAndHours();
      },
      error: err => console.error('No se pudo obtener el usuario actual', err)
    });
  }

  private buildForm() {
    const group: any = {};
    for (let d = 0; d < 7; d++) {
      group[`enabled_${d}`]       = [false];
      group[`morningStart_${d}`]  = [''];
      group[`morningEnd_${d}`]    = [''];
      group[`afternoonStart_${d}`]= [''];
      group[`afternoonEnd_${d}`]  = [''];
    }
    this.scheduleForm = this.fb.group(group);
  }

  private async loadProfileAndHours() {
    try {
      // 1) Traer duración de consulta usando lastValueFrom
      const profile = await firstValueFrom(
        this.profileService.getProfile(this.userId)
      );
      // profile es definitivamente PsychologistProfile
      this.consultationDuration = profile.consultationDuration;
  
      // 2) Traer franjas actuales
      const whs = await firstValueFrom(
        this.whService.getWorkingHours(this.userId)
      );
      whs.forEach((wh: WorkingHourDTO) => {
        const d = wh.dayOfWeek;
        this.scheduleForm.patchValue({ [`enabled_${d}`]: true });
        const start = wh.startTime.slice(0, 5);
        const end   = wh.endTime.slice(0, 5);
        if (start < '12:00') {
          this.scheduleForm.patchValue({
            [`morningStart_${d}`]: start,
            [`morningEnd_${d}`]: end
          });
        } else {
          this.scheduleForm.patchValue({
            [`afternoonStart_${d}`]: start,
            [`afternoonEnd_${d}`]: end
          });
        }
      });
    } catch (err) {
      console.error('Error cargando perfil o franjas', err);
    }
  }

  async onSave() {
    const dtos: WorkingHourDTO[] = [];
    for (let d = 0; d < 7; d++) {
      if (!this.scheduleForm.value[`enabled_${d}`]) continue;
      const mS = this.scheduleForm.value[`morningStart_${d}`];
      const mE = this.scheduleForm.value[`morningEnd_${d}`];
      const aS = this.scheduleForm.value[`afternoonStart_${d}`];
      const aE = this.scheduleForm.value[`afternoonEnd_${d}`];
      if (mS && mE) dtos.push({ dayOfWeek:d, startTime:`${mS}:00`, endTime:`${mE}:00` });
      if (aS && aE) dtos.push({ dayOfWeek:d, startTime:`${aS}:00`, endTime:`${aE}:00` });
    }

    try {
      await this.whService.replaceWorkingHours(this.userId, dtos).toPromise();
      alert('Horario guardado con éxito');
    } catch (err) {
      console.error('Error guardando horario', err);
      alert('No se pudo guardar el horario. Inténtalo de nuevo.');
    }
  }
}