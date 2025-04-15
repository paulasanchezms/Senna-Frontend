import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, RegisterRequest, AuthResponse } from 'src/app/services/auth.service';

@Component({
  standalone:false,
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  registerData: RegisterRequest = {
    name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'PATIENT'
  };

  message: string = '';

  constructor(private authService: AuthService, private router:Router) {}

  onRegister(): void {
    this.authService.register(this.registerData).subscribe({
      next: (response: AuthResponse) => {
        // Guardar el token en localStorage
        localStorage.setItem('authToken', response.jwt);
        
        // Redirigir o mostrar mensaje
        this.message = 'Registro exitoso. ¡Bienvenido!';
        // Aquí puedes redirigir si quieres
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.message = 'Error en el registro: ' + (error.error?.message || error.message);
      }
    });
  }
}