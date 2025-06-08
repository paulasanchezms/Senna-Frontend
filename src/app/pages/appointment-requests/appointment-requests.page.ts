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


  // Carga las citas pendientes para el psicólogo autenticado
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

  // Acepta una cita por su ID y actualiza la lista
  accept(id: number) {
    this.appointmentService.acceptAppointment(id).subscribe({
      next: () => {
        this.showToast('Cita aceptada');
        this.loadPendingAppointments();
        this.appointmentService.fetchAndUpdatePendingCount(); 
      },
      error: () => this.showToast('Error al aceptar cita')
    });
  }
  
  // Rechaza una cita por su ID y actualiza la lista
  reject(id: number) {
    this.appointmentService.rejectAppointment(id).subscribe({
      next: () => {
        this.showToast('Cita rechazada');
        this.loadPendingAppointments();
        this.appointmentService.fetchAndUpdatePendingCount(); 
      },
      error: () => this.showToast('Error al rechazar cita')
    });
  }

  // Muestra un toast con el mensaje especificado
  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color: 'success'
    });
    toast.present();
  }
}