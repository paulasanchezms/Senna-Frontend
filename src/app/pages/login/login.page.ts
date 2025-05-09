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
        // Guardamos el token
        const token = response.jwt;
        localStorage.setItem('authToken', token);
  
        // Extraemos el rol del JWT y lo guardamos
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role: 'PATIENT' | 'PSYCHOLOGIST' = payload.role;
        localStorage.setItem('userRole', role);
  
        // Redirigimos a la ruta raíz de ese rol
        if (role === 'PATIENT') {
          this.router.navigate(['/menu-patient']);
        } else if (role === 'PSYCHOLOGIST') {
          this.router.navigate(['/psychologist-navbar']);
        } else {
          // por si el token viniera mal formado
          this.router.navigate(['/login']);
        }
      },
      error: err => {
        this.message = 'Error en el inicio de sesión: ' + (err.error?.message || err.message);
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