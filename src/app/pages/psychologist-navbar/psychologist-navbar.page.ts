import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppointmentService } from 'src/app/services/appointment.service';
import { AuthService } from 'src/app/services/auth.service';
import { PsychologistProfileService } from 'src/app/services/psychologist-profile.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  standalone: false,
  selector: 'app-psychologist-navbar',
  templateUrl: './psychologist-navbar.page.html',
  styleUrls: ['./psychologist-navbar.page.scss']
})
export class PsychologistNavbarPage implements OnInit, OnDestroy {
  isMenuOpen = false;
  isAdmin = false;
  pendingCount: number = 0;
  showProfileWarning: boolean = false;

  private pendingSub!: Subscription;
  private profileStatusSub!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private appointmentService: AppointmentService,
    private userService: UserService,
    private profileService: PsychologistProfileService
  ) {}

  ngOnInit(): void {
    // Actualizar contador de solicitudes pendientes
    this.appointmentService.fetchAndUpdatePendingCount();
    this.pendingSub = this.appointmentService
      .getPendingCountObservable()
      .subscribe(count => {
        this.pendingCount = count;
      });

    // Revisar rol
    const role = this.authService.getRole();
    this.isAdmin = role === 'ADMIN';

    // Cargar perfil y suscribirse a los cambios en su completitud
    if (role === 'PSYCHOLOGIST') {
      this.profileStatusSub = this.profileService.profileCompletionStatus$.subscribe(complete => {
        this.showProfileWarning = !complete;
      });

      // Inicializar estado una vez al inicio
      this.userService.me().subscribe(user => {
        this.profileService.getProfile(user.id_user).subscribe(profile => {
          this.profileService.updateProfileCompletionStatus(profile);
        });
      });
    }
  }

  ngOnDestroy(): void {
    this.pendingSub?.unsubscribe();
    this.profileStatusSub?.unsubscribe();
  }

  // Abre/cierra el menú lateral
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }


  // Cierra el menú  
  closeMenu() {
    this.isMenuOpen = false;
  }

  // Cierra sesión y redirige al login
  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }
}