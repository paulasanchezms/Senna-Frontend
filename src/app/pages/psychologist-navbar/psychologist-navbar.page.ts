import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  standalone:false,
  selector: 'app-psychologist-navbar',
  templateUrl: './psychologist-navbar.page.html',
  styleUrls: ['./psychologist-navbar.page.scss']
})
export class PsychologistNavbarPage {

  constructor(private authService: AuthService, private router: Router) {}

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  logout() {
    this.authService.logout(); // elimina token en el AuthService
    this.router.navigate(['/login']);
  }
}