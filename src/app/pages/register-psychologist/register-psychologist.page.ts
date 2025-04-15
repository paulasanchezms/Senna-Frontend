import { Component } from '@angular/core';
import { AuthService, AuthResponse } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone:false,
  selector: 'app-register-psychologist',
  templateUrl: './register-psychologist.page.html',
  styleUrls: ['./register-psychologist.page.scss'],
})
export class RegisterPsychologistPage {
  psychologistData: any = {
    name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'PSYCHOLOGIST',
    dni: '',
    qualification: '',
    specialty: '',
    location: '',
    document: ''
  };

  message: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister(): void {
    this.authService.register(this.psychologistData).subscribe({
      next: (response: AuthResponse) => {
        localStorage.setItem('authToken', response.jwt);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.message = 'Error en el registro: ' + (error.error?.message || error.message);
      }
    });
  }
}