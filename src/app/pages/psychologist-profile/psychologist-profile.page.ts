import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';import { UserService } from '../../services/user.service';
import { PsychologistProfileService } from '../../services/psychologist-profile.service';
import { UserResponseDTO } from '../../models/user';
import { PsychologistProfile } from '../../models/psychologist-profile';
import { WorkingHourDTO } from 'src/app/models/working-hour';
import { firstValueFrom } from 'rxjs';
import { ReviewService } from 'src/app/services/review.service';
import { ReviewDTO } from 'src/app/models/review';
import { AlertController } from '@ionic/angular';

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
  scheduleForm!: FormGroup;

  isOwnProfile = true;
  defaultAvatar = '/assets/images/default-avatar.png';
  previewUrl: string | null = null;
  profilePhotoFile: File | null = null;
  documentFile: File | null = null;
  uploadedDocumentName: string | null = null;
  consultationDuration!: number;

  private userId!: number;
  private _editMode = false;
  private _activeTab: 'personal' | 'professional' = 'personal';

  days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  reviews: ReviewDTO[] = [];
  visibleReviews: ReviewDTO[] = [];
  averageRating: number = 0;
  pageSize: number = 5;

  @ViewChild('locationInput') locationInput!: ElementRef<HTMLInputElement>;

  constructor(
    private userService: UserService,
    private profileService: PsychologistProfileService,
    private fb: FormBuilder,
    private reviewService: ReviewService,
    private alertCtrl: AlertController
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
      this.loadReviews();
    });
  }

  ngAfterViewInit(): void {
    this.tryInitAutocomplete();
  }

  // Devuelve si el modo edición está activo
  get editMode(): boolean {
    return this._editMode;
  }

  // Activa/desactiva el modo edición y rellena formularios con los datos actuales
  set editMode(value: boolean) {
    this._editMode = value;

    if (value && this._activeTab === 'personal' && this.user) {
      this.personalForm.patchValue({
        name: this.user.name || '',
        last_name: this.user.last_name || '',
        phone: this.user.phone || ''
      });
    }

    if (value && this._activeTab === 'professional' && this.profile) {
      this.professionalForm.patchValue({
        specialty: this.profile.specialty || '',
        location: this.profile.location || '',
        consultationDuration: this.profile.consultationDuration || 0,
        consultationPrice: this.profile.consultationPrice || 0,
        document: this.profile.document || '',
        description: this.profile.description || ''
      });
    }

    this.tryInitAutocomplete();
  }

  // Devuelve la pestaña actualmente activa
  get activeTab(): 'personal' | 'professional' {
    return this._activeTab;
  }

  // Cambia de pestaña y actualiza los formularios si está en modo edición
  set activeTab(value: 'personal' | 'professional') {
    this._activeTab = value;

    if (this.editMode && value === 'personal' && this.user) {
      this.personalForm.patchValue({
        name: this.user.name || '',
        last_name: this.user.last_name || '',
        phone: this.user.phone || ''
      });
    }

    if (this.editMode && value === 'professional' && this.profile) {
      this.professionalForm.patchValue({
        specialty: this.profile.specialty || '',
        location: this.profile.location || '',
        consultationDuration: this.profile.consultationDuration || 0,
        consultationPrice: this.profile.consultationPrice || 0,
        document: this.profile.document || '',
        description: this.profile.description || ''
      });
    }

    this.tryInitAutocomplete();
  }

  // Construye formularios de datos personales y profesionales con validaciones
  buildForms() {
    this.personalForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]],
      last_name: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]],
      phone: ['', [Validators.pattern(/^[0-9]{9,15}$/)]]
    });
  
    this.professionalForm = this.fb.group({
      specialty: ['', Validators.required],
      location: ['', Validators.required],
      consultationDuration: [0, [Validators.required, Validators.min(1)]],
      consultationPrice: [0, [Validators.required, Validators.min(1)]],
      document: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  // Construye el formulario de horarios con campos para mañana y tarde
  buildScheduleForm() {
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

  // Carga el perfil profesional del usuario y lo aplica al formulario
  loadProfile() {
    this.profileService.getProfile(this.userId).subscribe(profile => {
      this.profile = profile;
      this.professionalForm.patchValue(profile);
    });
  }

  // Carga el perfil y las franjas horarias del psicólogo y rellena el formulario de horarios
  async loadProfileAndHours() {
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

  // Guarda los datos personales del usuario si el formulario es válido
  async savePersonal() {
    if (this.personalForm.invalid) {
      this.presentAlert('Revisa los datos del formulario personal.');
      return;
    }
    const data = this.personalForm.value;
    try {
      await firstValueFrom(this.userService.updateMe(data));
      await this.exitEditModeAndReload();
    } catch (err) {
      console.error('Error al guardar datos personales', err);
      this.presentAlert('No se pudo guardar. Intenta nuevamente.');
    }
  }
    
  // Guarda los datos profesionales del perfil si el formulario es válido
  async saveProfessional() {
    const data = this.professionalForm.value;
    try {
      await firstValueFrom(this.profileService.updateProfile(this.userId, data));
      await this.exitEditModeAndReload();
    } catch (err) {
      console.error('Error al guardar datos profesionales', err);
      this.presentAlert('No se pudo guardar. Intenta nuevamente.');
    }
  }

    // Sale del modo edición y recarga los datos del usuario y perfil
  async exitEditModeAndReload() {
    this._editMode = false;
    try {
      this.user = await firstValueFrom(this.userService.me());
      this.profile = await firstValueFrom(this.profileService.getProfile(this.userId));
      this.profileService.updateProfileCompletionStatus(this.profile);
    } catch (err) {
      console.error('Error recargando datos tras la edición', err);
    }
  }

  // Cancela la edición y recarga los datos originales
  onCancelEdit() {
    this.exitEditModeAndReload();
  }

  // Guarda las franjas horarias definidas, validando solapamientos
  async saveSchedule() {
    const dtos: WorkingHourDTO[] = [];

    for (let d = 0; d < 7; d++) {
      if (!this.scheduleForm.value[`enabled_${d}`]) continue;

      const mS = this.scheduleForm.value[`morningStart_${d}`];
      const mE = this.scheduleForm.value[`morningEnd_${d}`];
      const aS = this.scheduleForm.value[`afternoonStart_${d}`];
      const aE = this.scheduleForm.value[`afternoonEnd_${d}`];

      if (mS && mE && mS > mE) {
        this.presentAlert(`Horario inválido: Mañana de ${this.days[d]} tiene hora de inicio mayor que la de fin`);
        return;
      }
      if (aS && aE && aS > aE) {
        this.presentAlert(`Horario inválido: Tarde de ${this.days[d]} tiene hora de inicio mayor que la de fin`);
        return;
      }
      if (mS && mE && aS && aE && mE > aS) {
        this.presentAlert(`Horario inválido: Mañana y tarde de ${this.days[d]} se solapan`);
        return;
      }

      if (mS && mE) dtos.push({ dayOfWeek: d, startTime: `${mS}:00`, endTime: `${mE}:00` });
      if (aS && aE) dtos.push({ dayOfWeek: d, startTime: `${aS}:00`, endTime: `${aE}:00` });
    }

    try {
      await firstValueFrom(this.profileService.replaceWorkingHours(this.userId, dtos));
      this.presentAlert('Horario guardado con éxito');
    } catch (err) {
      this.presentAlert('No se pudo guardar el horario. Intenta nuevamente.');
    }
  }

  // Inicia el autocompletado de ubicación si está en modo edición y pestaña profesional
  tryInitAutocomplete() {
    setTimeout(() => {
      if (this.editMode && this.activeTab === 'professional' && this.locationInput) {
        this.initAutocomplete();
      }
    }, 200);
  }

  // Configura Google Places Autocomplete en el campo de ubicación
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

  // Procesa la imagen seleccionada, la sube a ImgBB y actualiza la foto de perfil
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
        error: async err => {
          await this.presentAlert('No se pudo subir la imagen. Intenta nuevamente.');
        }
      });
    }
  }

  // Sube el documento seleccionado, actualiza el perfil y guarda los cambios
  onDocumentSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.documentFile = file;
      this.uploadedDocumentName = file.name;
  
      this.userService.uploadToImgBB(file).subscribe({
        next: (url: string) => {
          this.professionalForm.patchValue({ document: url });
  
          const update = { ...this.professionalForm.value, document: url };
          this.profileService.updateProfile(this.userId, update).subscribe({
            next: () => {
              this.profile.document = url;
              this.profileService.updateProfileCompletionStatus(this.profile); 
            },
            error: async err => {
              await this.presentAlert('No se pudo guardar el documento. Intenta nuevamente.');
            }
          });
        },
        error: async err => {
          await this.presentAlert('No se pudo subir el documento. Intenta nuevamente.');
        }
      });
    }
  }

  // Agrupa las franjas horarias por día para mostrarlas organizadamente
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

  // Carga las valoraciones del psicólogo y calcula la media
  loadReviews() {
    if (!this.user?.id_user) return;
    this.reviewService.getReviews(this.user.id_user).subscribe({
      next: (res) => {
        this.reviews = res.map(r => ({
          ...r,
          createdAt: this.parseDateString(r.createdAt)
        }));
        this.visibleReviews = this.reviews.slice(0, this.pageSize);
        this.calculateAverageRating();
      },
      error: (err) => {
        console.error('Error cargando valoraciones', err);
      }
    });
  }
  
  // Convierte fechas al formato ISO
  parseDateString(dateStr: string): string {
    if (dateStr.includes('T')) return dateStr; 
    const [datePart, timePart] = dateStr.split(' ');
    const [day, month, year] = datePart.split('/');
    return new Date(`${year}-${month}-${day}T${timePart}`).toISOString();
  }

  // Muestra más valoraciones al usuario (paginación)
  showMoreReviews() {
    const next = this.visibleReviews.length + this.pageSize;
    this.visibleReviews = this.reviews.slice(0, next);
  }

  // Calcula la media de puntuaciones a partir de las valoraciones
  calculateAverageRating() {
    if (this.reviews.length === 0) {
      this.averageRating = 0;
      return;
    }
    const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
    this.averageRating = total / this.reviews.length;
  }

  // Devuelve true si el perfil está incompleto (para mostrar alerta)
  get shouldShowIncompleteAlert(): boolean {
    return !!(this.profile && !this.profileService.isProfileComplete(this.profile));
  }

  // Devuelve true si el acceso del psicólogo debe estar bloqueado
  get isAccessBlocked(): boolean {
    return !!(this.user && this.profile && !this.profileService.canAccessFeatures(this.user, this.profile));
  }

  // Muestra una alerta con el mensaje proporcionado
  async presentAlert(message: string) {
    const alert = await this.alertCtrl.create({
      message,
      buttons: ['Aceptar']
    });
    await alert.present();
  }
}