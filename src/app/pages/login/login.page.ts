import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, AuthResponse } from '../../services/auth.service';
import { UserService } from 'src/app/services/user.service'; // ← Añadido

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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService, // ← Inyectado
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
    this.loginForm.reset();
    this.message = '';
    this.formSubmitted = false;
  }

  onLogin(): void {
    this.formSubmitted = true;
    if (this.loginForm.invalid) return;

    this.authService.login(this.loginForm.value).subscribe({
      next: (response: AuthResponse) => {
        localStorage.setItem('authToken', response.jwt);

        this.userService.me().subscribe({
          next: (user) => {
            console.log(user);
            const role = user.role;
            const accepted = user.termsAccepted;

            if (role === 'PATIENT') {
              this.router.navigate(['/patient/home']);
            } else if (role === 'PSYCHOLOGIST') {
              if (!accepted) {
                this.router.navigate(['/unauthorized']);
              } else {
                this.router.navigate(['/calendar']);
              }
            } else if (role === 'ADMIN') {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/unauthorized']);
              this.message = 'Rol no reconocido. Contacta con soporte.';
            }
          },
          error: () => {
            this.message = 'No se pudieron obtener los datos del usuario.';
            this.router.navigate(['/unauthorized']);
          },
        });
      },
      error: (error) => {
        this.message =
          'Error en el inicio de sesión: ' +
          (error.error?.message || error.message);
      },
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
