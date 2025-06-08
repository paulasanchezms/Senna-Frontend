import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // ← si tienes AuthService

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) {}

    /**
   * Permite acceder a la ruta solo si hay un token de autenticación en localStorage.
   * Si no hay token, redirige al login.
   */
  canActivate(): boolean {
    const token = localStorage.getItem('authToken');
    if (token) {
      return true; 
    } else {
      this.router.navigate(['/login']);
      return false; 
    }
  }
}