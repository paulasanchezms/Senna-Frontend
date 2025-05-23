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
    this.loadPsychologists();
  }

  loadPsychologists() {
    this.userService.getPsychologists().subscribe((data) => {
      this.psychologists = data;
    });
  }

  normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');  // elimina acentos
  }

  search() {
    const normalizedSearch = this.normalizeText(this.searchTerm);
    const normalizedLocation = this.normalizeText(this.locationTerm);

    if (normalizedSearch || normalizedLocation) {
      this.userService.getPsychologists().subscribe((data) => {
        this.psychologists = data.filter((psy) => {
          const name = this.normalizeText(`${psy.name} ${psy.last_name}`);
          const specialty = this.normalizeText(psy.specialty || '');
          const location = this.normalizeText(psy.location || '');

          const matchesSpecialtyOrName =
            !normalizedSearch ||
            name.includes(normalizedSearch) ||
            specialty.includes(normalizedSearch);

          const matchesLocation =
            !normalizedLocation || location.includes(normalizedLocation);

          return matchesSpecialtyOrName && matchesLocation;
        });
      });
    } else {
      this.loadPsychologists();
    }
  }

  onInputChange() {
    if (!this.searchTerm.trim() && !this.locationTerm.trim()) {
      this.loadPsychologists();
    } else {
      this.search();
    }
  }

  goToPsychologistSchedule(id_user: number) {
    this.router.navigate(['/schedule-appointment', id_user]);
  }
}