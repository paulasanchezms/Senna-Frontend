import { Component, OnInit } from '@angular/core';
import { UserResponseDTO } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-search-psychologist',
  templateUrl: './search-psychologist.page.html',
})
export class SearchPsychologistPage implements OnInit {
  psychologists: UserResponseDTO[] = [];
  searchTerm: string = '';
  locationTerm: string = '';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    console.log('Componente search cargado');

    this.loadPsychologists();
  }

  // Carga todos los psicólogos activos desde el backend
  loadPsychologists() {
    console.log('Cargando psicólogos...');
    this.userService.getPsychologists().subscribe({
      next: (data) => {
        console.log('Datos recibidos:', data);
        this.psychologists = data.filter(p => p.active); 
      },
      error: (err) => {
        console.error('Error al obtener psicólogos:', err);
      }
    });
  }

  // Normaliza texto eliminando mayúsculas y acentos para búsquedas más flexibles
  normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, ''); 
  }

// Aplica filtros de búsqueda por nombre/especialidad y ubicación
search() {
  const normalizedSearch = this.normalizeText(this.searchTerm);
  const normalizedLocation = this.normalizeText(this.locationTerm);

  this.userService.getPsychologists().subscribe((data) => {
    this.psychologists = data
      .filter(p => p.active)
      .filter((psy) => {
        const name = this.normalizeText(`${psy.name} ${psy.last_name}`);
        const specialty = this.normalizeText(psy.profile?.specialty || '');
        const location = this.normalizeText(psy.profile?.location || '');

        const matchesSpecialtyOrName =
          !normalizedSearch ||
          name.includes(normalizedSearch) ||
          specialty.includes(normalizedSearch);

        const matchesLocation =
          !normalizedLocation || location.includes(normalizedLocation);

        return matchesSpecialtyOrName && matchesLocation;
      });
  });
}

  // Se ejecuta al escribir en los campos de búsqueda; si están vacíos, recarga todos
  onInputChange() {
    if (!this.searchTerm.trim() && !this.locationTerm.trim()) {
      this.loadPsychologists();
    } else {
      this.search();
    }
  }

  // Navega al perfil público del psicólogo seleccionado
  goToPublicProfile(id_user: number) {
    this.router.navigate(['/psychologist-public', id_user]);
  }
}
