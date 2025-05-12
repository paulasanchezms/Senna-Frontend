import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone:false,
  selector: 'app-patient-tabs',
  templateUrl: './patient-tabs.page.html'
})
export class PatientTabsPage implements OnInit {
  isPatient = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.isPatient = this.authService.getRole() === 'PATIENT';
    if (!this.isPatient) {
      this.router.navigate(['/unauthorized']);
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}