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

  // Carga los pacientes asignados al psicólogo desde el servicio
  loadPatients() {
    this.appointmentService.getPatientsForPsychologist().subscribe({
      next: (res) => {
        this.patients = res;
        this.filteredPatients = res;
      },
      error: (err) => console.error('Error al cargar pacientes', err)
    });
  }

  // Filtra la lista según el término de búsqueda (nombre o apellidos)
  onInputChange() {
    const term = this.searchTerm.toLowerCase();
    this.filteredPatients = this.patients.filter(p =>
      (p.name + ' ' + p.last_name).toLowerCase().includes(term)
    );
  }

  // Se llama al hacer clic en el botón de buscar
  search() {
    this.onInputChange();
  }

  // Navega al perfil público del paciente seleccionado
  goToPatientView(id_user: number) {
    this.router.navigate(['/public-patient-profile', id_user]);
  }
}
