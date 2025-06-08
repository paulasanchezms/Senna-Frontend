import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PatientGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

    /**
   * Permite acceder a una ruta solo si el rol del usuario es 'PATIENT'.
   * Si no lo es, redirige a una página de acceso no autorizado.
   */
  canActivate(): boolean {
    const role = this.authService.getRole();
    console.log('ROLE en PatientGuard:', role);

    if (role === 'PATIENT') {
      return true;
    } else {
      this.router.navigate(['/unauthorized']);
      return false;
    }
  }
}