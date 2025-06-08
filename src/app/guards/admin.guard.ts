import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) {}


  /**
   * Método que determina si se puede activar una ruta protegida por el guard.
   * Solo permite el acceso si el usuario autenticado tiene rol 'ADMIN'.
   * Si no, redirige al home ('/') y bloquea el acceso.
   */
  canActivate(): boolean {
    const user = this.authService.getCurrentUser();
    if (user?.role === 'ADMIN') {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}