import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PsychologistGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

    /**
   * Permite acceder a la ruta solo si el usuario tiene el rol 'PSYCHOLOGIST'.
   * Si no lo tiene, redirige al usuario a una página de acceso no autorizado.
   */
  canActivate(): boolean {
    const role = this.authService.getRole();
    if (role === 'PSYCHOLOGIST') {
      return true;
    } else {
      this.router.navigate(['/unauthorized']);
      return false;
    }
  }
}