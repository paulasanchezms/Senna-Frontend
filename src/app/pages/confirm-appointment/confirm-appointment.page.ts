import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentDTO } from 'src/app/models/appointment';
import { AppointmentService } from 'src/app/services/appointment.service';
import { UserResponseDTO } from 'src/app/models/user';
import { AlertController } from '@ionic/angular';

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
    private appointmentService: AppointmentService,
    private alertCtrl: AlertController
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
        this.alertCtrl.create({
          header: 'Solicitud enviada',
          message: 'Tu solicitud de cita ha sido enviada correctamente. Recibirás una confirmación cuando el profesional la acepte.',
          buttons: [{
            text: 'Entendido',
            handler: () => this.router.navigate(['/patient/home'])
          }]
        }).then(alert => alert.present());
      },
      error: err => {
        console.error('Error al confirmar la cita:', err);
        this.alertCtrl.create({
          header: 'Error',
          message: 'No se pudo enviar la solicitud de cita. Por favor, intenta de nuevo.',
          buttons: ['Aceptar']
        }).then(alert => alert.present());
      }
    });
  }

  get formattedTime(): string {
    return this.appointmentSummary.time?.substring(0, 5) || '';
  }
}