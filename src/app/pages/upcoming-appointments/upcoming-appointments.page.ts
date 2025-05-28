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

  upcomingAppointmentsGrouped: {
    psychologistId: number;
    psychologistName: string;
    appointments: AppointmentResponseDTO[];
  }[] = []; 

  constructor(
    private alertCtrl: AlertController,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.appointmentService.getPatientAppointments().subscribe({
      next: (appointments) => {
        const now = new Date();

        this.upcomingAppointments = appointments.filter(appt =>
          appt.status === 'CONFIRMADA' && new Date(appt.dateTime) >= now
        );

        this.pastAppointments = appointments.filter(appt =>
          appt.status === 'CONFIRMADA' && new Date(appt.dateTime) < now
        );

        this.groupUpcomingAppointments();
      },
      error: err => console.error('Error cargando citas', err)
    });
  }

  groupUpcomingAppointments() {
    const grouped = new Map<number, {
      psychologistId: number;
      psychologistName: string;
      appointments: AppointmentResponseDTO[];
    }>();

    for (const appt of this.upcomingAppointments) {
      const id = appt.psychologist.id_user;
      const name = ` ${appt.psychologist.name} ${appt.psychologist.last_name}`;

      if (!grouped.has(id)) {
        grouped.set(id, {
          psychologistId: id,
          psychologistName: name,
          appointments: []
        });
      }

      grouped.get(id)!.appointments.push(appt);
    }

    this.upcomingAppointmentsGrouped = Array.from(grouped.values());
  }

  confirmCancel(appointmentId: number) {
    this.alertCtrl.create({
      header: 'Cancelar cita',
      message: '¿Estás seguro/a de que deseas cancelar esta cita?',
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
      this.loadAppointments();
    });
  }

  confirmCancelAll(psychologistId: number) {
    this.alertCtrl.create({
      header: 'Cancelar todas las citas',
      message: '¿Quieres cancelar todas las citas con este profesional?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Sí, cancelar todas',
          handler: () => this.cancelAllAppointmentsWithPsychologist(psychologistId)
        }
      ]
    }).then(alert => alert.present());
  }

  cancelAllAppointmentsWithPsychologist(psychologistId: number) {
    this.appointmentService.cancelAllWithPsychologist(psychologistId).subscribe(() => {
      this.loadAppointments();
    });
  }
}