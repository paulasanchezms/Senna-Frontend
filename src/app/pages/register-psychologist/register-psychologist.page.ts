import { Component, OnInit, HostListener } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, AuthResponse } from 'src/app/services/auth.service';

declare var google: any; // Importante para acceder a la API de Google fuera de TypeScript

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
  selectedFile: File | null = null;
  message: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, this.onlyLettersValidator]],
      last_name: ['', [Validators.required, this.twoLastNamesValidator]],
      email: [
        '',
        [Validators.required, Validators.email, this.customEmailValidator],
      ],
      password: [
        '',
        [Validators.required, Validators.minLength(6), this.passwordValidator],
      ],
      dni: ['', [Validators.required]],
      qualification: ['', [Validators.required]],
      specialty: ['', [Validators.required]],
      location: ['', [Validators.required]],
      role: ['PSYCHOLOGIST'],
    });

    this.registerForm.get('name')!.valueChanges.subscribe((value) => {
      if (typeof value === 'string') {
        this.registerForm
          .get('name')!
          .setValue(value.trim(), { emitEvent: false });
      }
    });

    this.checkScreenSize();
  }

  // Aquí se carga el autocompletado de Google Places
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

  onRegister(): void {
    this.formSubmitted = true;

    if (this.registerForm.invalid || !this.selectedFile) {
      return;
    }

    const formData = new FormData();

    Object.entries(this.registerForm.value).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    formData.append('document', this.selectedFile!);

    this.authService.register(formData).subscribe({
      next: (response: AuthResponse) => {
        localStorage.setItem('authToken', response.jwt);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.message =
          'Error en el registro: ' + (error.error?.message || error.message);
      },
    });
  }

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

  onlyLettersValidator(control: AbstractControl): ValidationErrors | null {
    const onlyLettersRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
    if (control.value && !onlyLettersRegex.test(control.value.trim())) {
      return { onlyLetters: true };
    }
    return null;
  }

  customEmailValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    if (/\s/.test(value)) return { invalidEmail: 'No debe contener espacios.' };
    if (/[*+?]/.test(value)) return { invalidEmail: 'No debe contener (*+?).' };
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) return { invalidEmail: 'Formato inválido.' };
    return null;
  }

  twoLastNamesValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value?.trim();
    if (!value) return null;

    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+(?: [a-zA-ZáéíóúÁÉÍÓÚñÑ]+)+$/;
    return regex.test(value) ? null : { invalidLastName: true };
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (file && allowedTypes.includes(file.type)) {
      this.selectedFile = file;
    } else {
      this.selectedFile = null;
    }
  }

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
  get dni() {
    return this.registerForm.get('dni');
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
}