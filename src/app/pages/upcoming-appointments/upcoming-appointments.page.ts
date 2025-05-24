import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentResponseDTO } from '../../models/appointment';
import { AlertController } from '@ionic/angular';

@Component({
  standalone: false,
  selector: 'app-upcoming-appointments',
  templateUrl: './upcoming-appointments.page.html',
  styleUrls: ['./upcoming-appointments.page.scss'],
})
export class UpcomingAppointmentsPage implements OnInit {
  upcomingAppointments: AppointmentResponseDTO[] = [];
  pastAppointments: AppointmentResponseDTO[] = [];

  constructor(private alertCtrl: AlertController,private appointmentService: AppointmentService) {}

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
  this.appointmentService.getPatientAppointments().subscribe({            next: (appointments) => {
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

  confirmCancel(appointmentId: number) {
    this.alertCtrl.create({
      header: 'Cancelar cita',
      message: '¿Estás segura de que deseas cancelar esta cita?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Sí, cancelar',
          handler: () => this.cancelAppointment(appointmentId)
        }
      ]
    }).then(alert => alert.present());
  }
  
  cancelAppointment(id: number) {
    this.appointmentService.cancelAppointment(id).subscribe(() => {
      this.loadAppointments(); // recargar citas tras cancelación
    });
  }
}