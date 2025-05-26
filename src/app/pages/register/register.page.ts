import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, AuthResponse } from '../../services/auth.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { TermsPatientPage } from '../terms-patient/terms-patient.page';
import { ModalController } from '@ionic/angular';

@Component({
  standalone: false,
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup;
  formSubmitted = false;
  message: string = '';
  isMobile = false;
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
        role: ['PATIENT'],
        confirmPassword: ['', Validators.required],
        termsAccepted: [false, Validators.requiredTrue],
      },
      {
        validators: [this.passwordsMatchValidator],
      }
    );

    ['name', 'last_name'].forEach((field) => {
      this.registerForm.get(field)?.valueChanges.subscribe((value) => {
        if (typeof value === 'string') {
          this.registerForm
            .get(field)
            ?.setValue(value.replace(/^\s+/, ''), { emitEvent: false });
        }
      });
    });

    this.checkScreenSize();
  }

  onRegister(): void {
    this.formSubmitted = true;
    if (this.registerForm.invalid) return;

    const raw = this.registerForm.value;

    this.authService.register(raw).subscribe({
      next: (response: AuthResponse) => {
        localStorage.setItem('authToken', response.jwt);
        this.message = 'Registro exitoso. ¡Bienvenido!';
        this.router.navigate(['/patient/home']);
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

  textValidator(control: AbstractControl): ValidationErrors | null {
    const trimmed = (control.value || '').trim();
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/;
    return trimmed && !regex.test(trimmed) ? { invalidText: true } : null;
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

  async openTermsModal() {
    const modal = await this.modalController.create({
      component: TermsPatientPage,
      breakpoints: [0.3, 0.5, 0.9],
    });
    await modal.present();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
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
  get termsAccepted() {
    return this.registerForm.get('termsAccepted');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  passwordsMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      return { passwordsMismatch: true };
    }
    return null;
  }
}
