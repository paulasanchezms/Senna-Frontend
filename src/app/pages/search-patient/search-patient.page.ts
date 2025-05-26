import { Component, OnInit } from '@angular/core';
import { UserResponseDTO } from '../../models/user';
import { AppointmentService } from '../../services/appointment.service';
import { Router } from '@angular/router';

@Component({
  standalone:false,
  selector: 'app-search-patient',
  templateUrl: './search-patient.page.html',
  styleUrls: ['./search-patient.page.scss'],
})
export class SearchPatientPage implements OnInit {
  patients: UserResponseDTO[] = [];
  filteredPatients: UserResponseDTO[] = [];
  searchTerm: string = '';

  constructor(private appointmentService: AppointmentService, private router: Router) {}

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {
    this.appointmentService.getPatientsForPsychologist().subscribe({
      next: (res) => {
        this.patients = res;
        this.filteredPatients = res;
      },
      error: (err) => console.error('Error al cargar pacientes', err)
    });
  }

  onInputChange() {
    const term = this.searchTerm.toLowerCase();
    this.filteredPatients = this.patients.filter(p =>
      (p.name + ' ' + p.last_name).toLowerCase().includes(term)
    );
  }

  search() {
    this.onInputChange();
  }

  goToPatientView(id_user: number) {
    this.router.navigate(['/public-patient-profile', id_user]);
  }
}
