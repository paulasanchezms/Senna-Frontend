import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentDTO } from 'src/app/models/appointment';
import { AppointmentService } from 'src/app/services/appointment.service';
import { UserResponseDTO } from 'src/app/models/user';

@Component({
  standalone: false,
  selector: 'app-confirm-appointment',
  templateUrl: './confirm-appointment.page.html',
})
export class ConfirmAppointmentPage implements OnInit {
  appointment!: AppointmentDTO;
  psychologist!: UserResponseDTO;

  appointmentSummary = {
    psychologistName: '',
    date: '',
    time: '',
    duration: 0
  };

  constructor(
    private router: Router,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit() {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras.state) {
      this.appointment = nav.extras.state['appointment'];
      this.psychologist = nav.extras.state['psychologist'];

      const [date, time] = this.appointment.dateTime.split('T');
      this.appointmentSummary = {
        psychologistName: `${this.psychologist.name} ${this.psychologist.last_name}`,
        date: date,
        time: time,
        duration: this.appointment.duration
      };
    }
  }

  finalize() {
    this.appointmentService.scheduleAppointment(this.appointment).subscribe({
      next: () => {
        alert('Cita reservada con éxito');
        this.router.navigate(['/patient/home']);
      },
      error: err => {
        console.error('Error al confirmar la cita:', err);
        alert('Error al confirmar la cita. Intenta de nuevo.');
      }
    });
  }
}