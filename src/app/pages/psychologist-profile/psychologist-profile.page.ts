import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { PsychologistProfileService } from '../../services/psychologist-profile.service';
import { UserResponseDTO } from '../../models/user';
import { PsychologistProfile } from '../../models/psychologist-profile';
import { WorkingHourDTO } from 'src/app/models/working-hour';
import { firstValueFrom } from 'rxjs';

declare var google: any;

@Component({
  standalone: false,
  selector: 'app-psychologist-profile',
  templateUrl: './psychologist-profile.page.html',
  styleUrls: ['./psychologist-profile.page.scss'],
})
export class PsychologistProfilePage implements OnInit, AfterViewInit {
  user!: UserResponseDTO;
  profile!: PsychologistProfile;

  personalForm!: FormGroup;
  professionalForm!: FormGroup;

  private _activeTab: 'personal' | 'professional' = 'personal';
  private _editMode = false;

  isOwnProfile = true;
  defaultAvatar = '/assets/default-avatar.png';
  private userId!: number;
  profilePhotoFile: File | null = null;
  documentFile: File | null = null;
  previewUrl: string | null = null;
  scheduleForm!: FormGroup;
  consultationDuration!: number;
  days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  @ViewChild('locationInput') locationInput!: ElementRef<HTMLInputElement>;

  constructor(
    private userService: UserService,
    private profileService: PsychologistProfileService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.userService.me().subscribe(user => {
      this.user = user;
      this.userId = user.id_user;
      this.previewUrl = user.photoUrl ?? null;
      this.buildForms();
      this.buildScheduleForm();
      this.loadProfile();
      this.loadProfileAndHours();
    });
  }

  ngAfterViewInit(): void {
    this.tryInitAutocomplete();
  }

  set activeTab(value: 'personal' | 'professional') {
    this._activeTab = value;
    this.tryInitAutocomplete();
  }

  get activeTab(): 'personal' | 'professional' {
    return this._activeTab;
  }

  set editMode(value: boolean) {
    this._editMode = value;
    this.tryInitAutocomplete();
  }

  get editMode(): boolean {
    return this._editMode;
  }

  tryInitAutocomplete() {
    setTimeout(() => {
      if (this.editMode && this.activeTab === 'professional' && this.locationInput) {
        this.initAutocomplete();
      }
    }, 200);
  }

  initAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(this.locationInput.nativeElement, {
      types: ['geocode'],
      componentRestrictions: { country: 'es' },
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      const location = place.formatted_address;
      this.professionalForm.patchValue({ location });
    });
  }

  buildForms() {
    this.personalForm = this.fb.group({
      name: [''],
      last_name: [''],
      phone: ['']
    });

    this.professionalForm = this.fb.group({
      specialty: [''],
      location: [''],
      consultationDuration: [0],
      consultationPrice: [0],
      document: [''],
      description: ['']
    });
  }

  loadProfile() {
    this.profileService.getProfile(this.userId).subscribe(profile => {
      this.profile = profile;
      this.professionalForm.patchValue(profile);
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.profilePhotoFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);

      this.userService.uploadToImgBB(file).subscribe({
        next: (url: string) => {
          this.userService.updateMe({ photoUrl: url }).subscribe(() => {
            this.user.photoUrl = url;
          });
        },
        error: err => {
          console.error('Error al subir la imagen de perfil', err);
          alert('No se pudo subir la imagen. Intenta nuevamente.');
        }
      });
    }
  }

  onDocumentSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.documentFile = file;
  
      this.userService.uploadToImgBB(file).subscribe({
        next: (url: string) => {
          this.professionalForm.patchValue({ document: url });

          const update = { ...this.professionalForm.value, document: url };
          this.profileService.updateProfile(this.userId, update).subscribe({
            next: () => {
              this.profile.document = url;
            },
            error: err => {
              console.error('Error al guardar el documento en el backend', err);
              alert('No se pudo guardar el documento. Intenta nuevamente.');
            }
          });
        },
        error: err => {
          console.error('Error al subir el documento', err);
          alert('No se pudo subir el documento. Intenta nuevamente.');
        }
      });
    }
  }

  savePersonal() {
    const data = this.personalForm.value;
    this.userService.updateMe(data).subscribe(() => {
      this.user = { ...this.user, ...data };
      this.editMode = false;
    });
  }

  saveProfessional() {
    const data = this.professionalForm.value;
    this.profileService.updateProfile(this.userId, data).subscribe(() => {
      this.profile = { ...this.profile, ...data };
      this.editMode = false;
    });
  }

  private buildScheduleForm() {
    const group: any = {};
    for (let d = 0; d < 7; d++) {
      group[`enabled_${d}`] = [false];
      group[`morningStart_${d}`] = [''];
      group[`morningEnd_${d}`] = [''];
      group[`afternoonStart_${d}`] = [''];
      group[`afternoonEnd_${d}`] = [''];
    }
    this.scheduleForm = this.fb.group(group);
  }

  private async loadProfileAndHours() {
    try {
      const profile = await firstValueFrom(this.profileService.getProfile(this.userId));
      this.consultationDuration = profile.consultationDuration;

      const whs = await firstValueFrom(this.profileService.getWorkingHours(this.userId));
      whs.forEach(wh => {
        const d = wh.dayOfWeek;
        this.scheduleForm.patchValue({ [`enabled_${d}`]: true });
        const start = wh.startTime.slice(0, 5);
        const end = wh.endTime.slice(0, 5);
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

  async saveSchedule() {
    const dtos: WorkingHourDTO[] = [];
  
    for (let d = 0; d < 7; d++) {
      if (!this.scheduleForm.value[`enabled_${d}`]) continue;
  
      const mS = this.scheduleForm.value[`morningStart_${d}`];
      const mE = this.scheduleForm.value[`morningEnd_${d}`];
      const aS = this.scheduleForm.value[`afternoonStart_${d}`];
      const aE = this.scheduleForm.value[`afternoonEnd_${d}`];
  
      // Validación de rangos individuales
      if (mS && mE && mS > mE) {
        alert(`Horario inválido: Mañana de ${this.days[d]} tiene hora de inicio mayor que la de fin`);
        return;
      }
      if (aS && aE && aS > aE) {
        alert(`Horario inválido: Tarde de ${this.days[d]} tiene hora de inicio mayor que la de fin`);
        return;
      }
  
      // Validación de solapamiento entre mañana y tarde
      if (mS && mE && aS && aE && mE > aS) {
        alert(`Horario inválido: Mañana y tarde de ${this.days[d]} se solapan`);
        return;
      }
  
      // Construcción segura de franjas
      if (mS && mE) dtos.push({ dayOfWeek: d, startTime: `${mS}:00`, endTime: `${mE}:00` });
      if (aS && aE) dtos.push({ dayOfWeek: d, startTime: `${aS}:00`, endTime: `${aE}:00` });
    }
  
    try {
      await firstValueFrom(this.profileService.replaceWorkingHours(this.userId, dtos));
      alert('Horario guardado con éxito');
    } catch (err) {
      console.error('Error guardando horario', err);
      alert('No se pudo guardar el horario. Intenta nuevamente.');
    }
  }

  get groupedWorkingHours(): { day: string, slots: { start: string, end: string }[] }[] {
    const daysMap: { [key: number]: string } = {
      0: 'Lunes', 1: 'Martes', 2: 'Miércoles', 3: 'Jueves',
      4: 'Viernes', 5: 'Sábado', 6: 'Domingo'
    };
  
    const grouped: { [day: string]: { start: string, end: string }[] } = {};
  
    this.profile?.workingHours?.forEach(slot => {
      const dayName = daysMap[slot.dayOfWeek];
      if (!grouped[dayName]) grouped[dayName] = [];
      grouped[dayName].push({
        start: slot.startTime.slice(0, 5),
        end: slot.endTime.slice(0, 5)
      });
    });
  
    return Object.entries(grouped).map(([day, slots]) => ({ day, slots }));
  }
}