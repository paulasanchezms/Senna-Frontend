import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, AuthResponse } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

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

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, this.onlyLettersValidator]],
      last_name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/)]],
      email: ['', [Validators.required, Validators.email, this.customEmailValidator]],
      password: ['', [Validators.required, Validators.minLength(6), this.passwordValidator]],
      role: ['PATIENT']
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
  }

  onRegister(): void {
    this.formSubmitted = true;
    if (this.registerForm.invalid) return;

    const formData = this.registerForm.value;

    this.authService.register(formData).subscribe({
      next: (response: AuthResponse) => {
        localStorage.setItem('authToken', response.jwt);
        this.message = 'Registro exitoso. ¡Bienvenido!';
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.message = 'Error en el registro: ' + (error.error?.message || error.message);
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

  get name() { return this.registerForm.get('name'); }
  get last_name() { return this.registerForm.get('last_name'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
}