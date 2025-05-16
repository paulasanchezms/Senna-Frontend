import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { PsychologistProfileService } from '../../services/psychologist-profile.service';
import { UserResponseDTO } from '../../models/user';
import { PsychologistProfile } from '../../models/psychologist-profile';

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

  activeTab: 'personal' | 'professional' = 'personal';
  editMode = false;
  isOwnProfile = true;
  defaultAvatar = '/assets/default-avatar.png';
  private userId!: number;
  profilePhotoFile: File | null = null;
  documentFile: File | null = null;
  previewUrl: string | null = null;

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
      this.loadProfile();
      this.buildForms();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.locationInput) {
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
    }, 0);
  }

  buildForms() {
    this.personalForm = this.fb.group({
      name: [this.user?.name || ''],
      last_name: [this.user?.last_name || ''],
      phone: [this.user?.phone || '']
    });

    this.professionalForm = this.fb.group({
      specialty: [''],
      location: [''],
      consultationDuration: [0],
      consultationPrice: [0],
      document: ['']
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
}
