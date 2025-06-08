import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { UserResponseDTO } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  standalone: false,
  selector: 'app-public-patient-profile',
  templateUrl: './public-patient-profile.page.html',
  styleUrls: ['./public-patient-profile.page.scss']
})
export class PublicPatientProfilePage implements OnInit {
  patient!: UserResponseDTO;
  defaultAvatar = 'assets/images/default-avatar.png';
  isPsychologist = false;
  patientId!: number;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.patientId = +id;
      this.userService.getPatientById(this.patientId).subscribe({
        next: (data) => this.patient = data,
        error: (err) => console.error('Error cargando perfil del paciente:', err)
      });
    }

    const currentUser = this.authService.getCurrentUser();
    this.isPsychologist = currentUser?.role === 'PSYCHOLOGIST';
  }
  
  // Redirige a la página de estadísticas del paciente
  goToStatistics() {
    this.router.navigate(['/statistics'], {
      queryParams: { patientId: this.patientId }
    });
  }
}