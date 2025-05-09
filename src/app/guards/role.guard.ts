import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole'); // "PATIENT" o "PSYCHOLOGIST"
    const expectedRole = route.data['expectedRole'];

    if (!token || !userRole) {
      // Usuario no autenticado o sin rol
      this.router.navigate(['/login']);
      return false;
    }

    if (userRole === expectedRole) {
      return true;
    }

    // Usuario con rol incorrecto: redirige a su página principal
    if (userRole === 'PATIENT') {
      this.router.navigate(['/menu-patient']);
    } else if (userRole === 'PSYCHOLOGIST') {
      this.router.navigate(['/psychologist-navbar']);
    } else {
      this.router.navigate(['/login']);
    }

    return false;
  }
}