import { Component } from '@angular/core';

@Component({
  standalone:false,
  selector: 'app-psychologist-navbar',
  templateUrl: './psychologist-navbar.page.html',
  styleUrls: ['./psychologist-navbar.page.scss']
})
export class PsychologistNavbarPage {
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}