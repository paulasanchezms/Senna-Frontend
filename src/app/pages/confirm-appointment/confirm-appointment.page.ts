import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentDTO } from 'src/app/models/appointment';
import { AppointmentService } from 'src/app/services/appointment.service';

@Component({
  standalone:false,
  selector: 'app-confirm-appointment',
  templateUrl: './confirm-appointment.page.html',
})
export class ConfirmAppointmentPage implements OnInit {
  appointment!: AppointmentDTO;

  appointmentSummary = {
    psychologistName: '',
    specialty: '',
    date: '',
    time: '',
    duration: 0
};

  constructor(private router: Router, private appointmentService: AppointmentService) {}

  ngOnInit() {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras.state && nav.extras.state['appointment']) {
      this.appointment = nav.extras.state['appointment'];
    }
  }

  finalize() {
    this.appointmentService.scheduleAppointment(this.appointment).subscribe(() => {
      alert('Cita reservada con éxito');
      this.router.navigate(['/home']);
    });
  }
}