import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, AuthResponse } from '../../services/auth.service';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  formSubmitted = false;
  message: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onLogin(): void {
    this.formSubmitted = true;
    if (this.loginForm.invalid) return;

    this.authService.login(this.loginForm.value).subscribe({
      next: (response: AuthResponse) => {
        localStorage.setItem('authToken', response.jwt);

        const role = this.authService.getRole();
        if (role === 'PATIENT') {
          this.router.navigate(['/patient/home']);
        } else if (role === 'PSYCHOLOGIST') {
          this.router.navigate(['/calendar']);
        } else {
          this.router.navigate(['/login']);
          this.message = 'Rol no reconocido. Contacta con soporte.';
        }
      },
      error: (error) => {
        this.message = 'Error en el inicio de sesión: ' + (error.error?.message || error.message);
      }
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}