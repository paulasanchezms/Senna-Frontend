import { Component } from '@angular/core';
import { AuthService, AuthRequest, AuthResponse } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone:false,
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginData: AuthRequest = {
    email: '',
    password: ''
  };

  message: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.authService.login(this.loginData).subscribe({
      next: (response: AuthResponse) => {
        localStorage.setItem('authToken', response.jwt);
        this.message = '';
        this.router.navigate(['/home']); // Redirige tras login
      },
      error: (error) => {
        this.message = 'Error en el login: ' + (error.error?.message || error.message);
      }
    });
  }
}