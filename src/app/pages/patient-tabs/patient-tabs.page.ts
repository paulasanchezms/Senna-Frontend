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
   
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}