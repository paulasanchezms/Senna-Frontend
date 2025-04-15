// src/app/pages/register/register.component.ts
import { Component } from '@angular/core';
import { AuthService, RegisterRequest, AuthResponse } from '../../../Services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  // Datos del formulario
  registerData: RegisterRequest = {
    name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'PATIENT'  // Puedes permitir seleccionar el rol si es necesario.
  };

  message: string = '';

  constructor(private authService: AuthService) {}

  onRegister(): void {
    this.authService.register(this.registerData).subscribe({
      next: (response: AuthResponse) => {
        this.message = 'Registro exitoso. Token: ' + response.jwt;
      },
      error: (error) => {
        this.message = 'Error en el registro: ' + (error.error?.message || error.message);
      }
    });
  }
}