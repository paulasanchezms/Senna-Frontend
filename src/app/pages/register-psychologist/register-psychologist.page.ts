import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, AuthResponse } from 'src/app/services/auth.service';

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

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, this.onlyLettersValidator]],
      last_name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/)]],
      email: ['', [Validators.required, Validators.email, this.customEmailValidator]],
      password: ['', [Validators.required, Validators.minLength(6), this.passwordValidator]],
      dni: ['', [Validators.required]],
      qualification: ['', [Validators.required]],
      specialty: ['', [Validators.required]],
      location: ['', [Validators.required]],
      document: ['', [Validators.required]],
      role: ['PSYCHOLOGIST']
    });

    this.registerForm.get('name')!.valueChanges.subscribe(value => {
      if (typeof value === 'string') {
        this.registerForm.get('name')!.setValue(value.trim(), { emitEvent: false });
      }
    });

    this.registerForm.get('last_name')!.valueChanges.subscribe(value => {
      if (typeof value === 'string') {
        this.registerForm.get('last_name')!.setValue(value.trim(), { emitEvent: false });
      }
    });

    this.checkScreenSize();
  }

  onRegister(): void {
    this.formSubmitted = true;

    if (this.registerForm.invalid) {
      console.log('Formulario inválido');
      return;
    }

    const formData = this.registerForm.value;

    this.authService.register(formData).subscribe({
      next: (response: AuthResponse) => {
        localStorage.setItem('authToken', response.jwt);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Error en el registro:', error);
      }
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

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
  }

  get name() { return this.registerForm.get('name'); }
  get last_name() { return this.registerForm.get('last_name'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get dni() { return this.registerForm.get('dni'); }
  get qualification() { return this.registerForm.get('qualification'); }
  get specialty() { return this.registerForm.get('specialty'); }
  get location() { return this.registerForm.get('location'); }
  get document() { return this.registerForm.get('document'); }
}
