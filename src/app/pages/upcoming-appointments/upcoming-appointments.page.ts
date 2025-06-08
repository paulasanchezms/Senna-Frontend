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

  // Obtiene todas las citas del paciente y las clasifica en futuras y pasadas
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

  // Agrupa las citas futuras por psicólogo
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

  // Muestra una alerta de confirmación antes de cancelar una cita individual
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

  // Cancela una cita individual y recarga las citas
  cancelAppointment(id: number) {
    this.appointmentService.cancelAppointment(id).subscribe(() => {
      this.loadAppointments();
    });
  }

  // Muestra una alerta de confirmación antes de cancelar todas las citas con un psicólogo
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

  // Cancela todas las citas con un psicólogo y recarga las citas
  cancelAllAppointmentsWithPsychologist(psychologistId: number) {
    this.appointmentService.cancelAllWithPsychologist(psychologistId).subscribe(() => {
      this.loadAppointments();
    });
  }
}