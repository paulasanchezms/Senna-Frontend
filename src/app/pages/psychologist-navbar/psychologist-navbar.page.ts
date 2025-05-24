import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  standalone: false,
  selector: 'app-psychologist-navbar',
  templateUrl: './psychologist-navbar.page.html',
  styleUrls: ['./psychologist-navbar.page.scss']
})
export class PsychologistNavbarPage {
  isMenuOpen = false;
  isAdmin = false;

  constructor(private authService: AuthService, private router: Router) {
    const role = this.authService.getRole();
    this.isAdmin = role === 'ADMIN';
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
