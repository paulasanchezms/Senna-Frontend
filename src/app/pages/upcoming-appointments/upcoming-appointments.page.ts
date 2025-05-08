import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentResponseDTO } from '../../models/appointment';

@Component({
  standalone: false,
  selector: 'app-upcoming-appointments',
  templateUrl: './upcoming-appointments.page.html',
  styleUrls: ['./upcoming-appointments.page.scss'],
})
export class UpcomingAppointmentsPage implements OnInit {
  upcomingAppointments: AppointmentResponseDTO[] = [];
  pastAppointments: AppointmentResponseDTO[] = [];

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.appointmentService.getPsychologistAppointments().subscribe({
            next: (appointments) => {
        const now = new Date();
        this.upcomingAppointments = appointments.filter(appt =>
          appt.status === 'CONFIRMADA' && new Date(appt.dateTime) >= now
        );
        this.pastAppointments = appointments.filter(appt =>
          appt.status === 'CONFIRMADA' && new Date(appt.dateTime) < now
        );
      },
      error: (err) => console.error('Error cargando citas', err)
    });
  }
}