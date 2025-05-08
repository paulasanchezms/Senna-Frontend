import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentResponseDTO } from '../../models/appointment';
import { ToastController } from '@ionic/angular';

@Component({
  standalone:false,
  selector: 'app-appointment-requests',
  templateUrl: './appointment-requests.page.html',
  styleUrls: ['./appointment-requests.page.scss'],
})
export class AppointmentRequestsPage implements OnInit {
  pendingAppointments: AppointmentResponseDTO[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.loadPendingAppointments();
  }

  loadPendingAppointments() {
    this.appointmentService.getPendingAppointmentsForPsychologist().subscribe({
      next: (appointments) => {
        this.pendingAppointments = appointments;
      },
      error: (err) => {
        this.showToast('Error al cargar solicitudes');
        console.error(err);
      }
    });
  }

  accept(id: number) {
    this.appointmentService.acceptAppointment(id).subscribe({
      next: () => {
        this.showToast('Cita aceptada');
        this.loadPendingAppointments();
      },
      error: () => this.showToast('Error al aceptar cita')
    });
  }

  reject(id: number) {
    this.appointmentService.rejectAppointment(id).subscribe({
      next: () => {
        this.showToast('Cita rechazada');
        this.loadPendingAppointments();
      },
      error: () => this.showToast('Error al rechazar cita')
    });
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color: 'success'
    });
    toast.present();
  }
}