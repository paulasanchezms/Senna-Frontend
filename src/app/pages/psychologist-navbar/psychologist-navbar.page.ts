import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppointmentService } from 'src/app/services/appointment.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  standalone: false,
  selector: 'app-psychologist-navbar',
  templateUrl: './psychologist-navbar.page.html',
  styleUrls: ['./psychologist-navbar.page.scss']
})
export class PsychologistNavbarPage implements OnInit, OnDestroy{
  isMenuOpen = false;
  isAdmin = false;
  pendingCount: number = 0;
  private subscription!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private appointmentService: AppointmentService
  ) {
    const role = this.authService.getRole();
    this.isAdmin = role === 'ADMIN';
  }


  ngOnInit(): void {
    this.appointmentService.fetchAndUpdatePendingCount();

    this.subscription = this.appointmentService.getPendingCountObservable().subscribe(count => {
      this.pendingCount = count;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  logout() {
    this.authService.logout();
    window.location.href = '/login';
    }
}
