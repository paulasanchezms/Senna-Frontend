import { Component, OnInit, HostListener } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, AuthResponse } from '../../services/auth.service';
import { ModalController } from '@ionic/angular';
import { TermsPsychologistPage } from '../terms-psychologist/terms-psychologist.page';

declare var google: any;

@Component({
  standalone: false,
  selector: 'app-register-psychologist',
  templateUrl: './register-psychologist.page.html',
  styleUrls: ['./register-psychologist.page.scss'],
})
export class RegisterPsychologistPage implements OnInit {
  registerForm!: FormGroup;
  formSubmitted = false;
  isMobile = false;
  message: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private modalController: ModalController
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, this.textValidator]],
        last_name: ['', [Validators.required, this.textValidator]],
        email: [
          '',
          [Validators.required, Validators.email, this.customEmailValidator],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            this.passwordValidator,
          ],
        ],
        confirmPassword: ['', Validators.required],
        qualification: [''],
        consultationDuration: [null],
        consultationPrice: [null],
        specialty: [''],
        location: [''],
        termsAccepted: [false, Validators.requiredTrue],
      },
      {
        validators: [this.passwordsMatchValidator],
      }
    );

    ['name', 'last_name', 'qualification', 'specialty', 'location'].forEach(
      (field) => {
        this.registerForm.get(field)?.valueChanges.subscribe((value) => {
          if (typeof value === 'string') {
            this.registerForm
              .get(field)
              ?.setValue(value.replace(/^\s+/, ''), { emitEvent: false });
          }
        });
      }
    );

    this.checkScreenSize();
  }

  ngAfterViewInit(): void {
    const input = document.getElementById('autocomplete') as HTMLInputElement;

    if (input) {
      const autocomplete = new google.maps.places.Autocomplete(input, {
        types: ['geocode'],
        componentRestrictions: { country: 'es' },
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        const location = place.formatted_address;

        this.registerForm.patchValue({ location });
      });
    }
  }

  // Envía el formulario al backend si es válido
  onRegister(): void {
    this.formSubmitted = true;
    if (this.registerForm.invalid) return;

    const v = this.registerForm.value;

    const userPart = {
      name: v.name,
      last_name: v.last_name,
      email: v.email,
      password: v.password,
      termsAccepted: v.termsAccepted,
    };

    const profilePart = {
      consultationDuration: v.consultationDuration,
      consultationPrice: v.consultationPrice,
      specialty: v.specialty,
      location: v.location,
      workingHours: [],
    };

    const formData = new FormData();

    formData.append(
      'user',
      new Blob([JSON.stringify(userPart)], { type: 'application/json' })
    );
    formData.append(
      'profile',
      new Blob([JSON.stringify(profilePart)], { type: 'application/json' })
    );

    this.authService.registerPsychologist(formData).subscribe({
      next: (response: AuthResponse) => {
        localStorage.setItem('authToken', response.jwt);
        this.router.navigate(['/calendar']);
      },
      error: (error) => {
        console.error('error registro', error);
        this.message =
          'Error en el registro: ' + (error.error?.message || error.message);
      },
    });
  }

  // Valida que la contraseña tenga al menos una mayúscula, un número y un carácter especial
  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    const hasUpper = /[A-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);
    if (!hasUpper || !hasNumber || !hasSpecial) {
      return { invalidPassword: true };
    }
    return null;
  }

  // Valida que el campo de texto contenga solo letras y espacios
  textValidator(control: AbstractControl): ValidationErrors | null {
    const trimmed = (control.value || '').trim();
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/;
    return trimmed && !regex.test(trimmed) ? { invalidText: true } : null;
  }

  // Valida el formato del email y evita caracteres no permitidos
  customEmailValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    if (/\s/.test(value)) return { invalidEmail: 'No debe contener espacios.' };
    if (/[*+?]/.test(value)) return { invalidEmail: 'No debe contener (*+?).' };
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) return { invalidEmail: 'Formato inválido.' };
    return null;
  }

  // Detecta cambios en el tamaño de la ventana para saber si es móvil
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
  }

  // Getters para acceder fácilmente a los campos del formulario en la plantilla
  get name() {
    return this.registerForm.get('name');
  }
  get last_name() {
    return this.registerForm.get('last_name');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get qualification() {
    return this.registerForm.get('qualification');
  }
  get specialty() {
    return this.registerForm.get('specialty');
  }
  get location() {
    return this.registerForm.get('location');
  }
  get document() {
    return this.registerForm.get('document');
  }

  get termsAccepted() {
    return this.registerForm.get('termsAccepted');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  // Abre el modal de términos y condiciones para psicólogos
  async openTermsModal() {
    const modal = await this.modalController.create({
      component: TermsPsychologistPage,
      breakpoints: [0.3, 0.5, 0.9],
    });
    await modal.present();
  }

  // Valida que la contraseña y la confirmación coincidan
  passwordsMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      return { passwordsMismatch: true };
    }
    return null;
  }
}
