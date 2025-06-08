import { Component, Input } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { AdminService } from 'src/app/services/admin.service';
import { UserResponseDTO } from 'src/app/models/user';

@Component({
  standalone: false,
  selector: 'app-psychologist-profile-modal',
  templateUrl: './psychologist-profile-modal.page.html',
  styleUrls: ['./psychologist-profile-modal.page.scss']
})
export class PsychologistProfileModalPage {

  @Input() psychologist!: UserResponseDTO;

  constructor(
    private adminService: AdminService,
    private toastController: ToastController,
    private modalController: ModalController
  ) {}

  // Aprueba al psicólogo y cierra el modal notificando éxito
  approve() {
    this.adminService.approvePsychologist(this.psychologist.id_user).subscribe(() => {
      this.presentToast('Psicólogo aprobado correctamente');
      this.modalController.dismiss(null, 'refresh');
    });
  }

  // Rechaza al psicólogo y cierra el modal notificando éxito
  reject() {
    this.adminService.rejectPsychologist(this.psychologist.id_user).subscribe(() => {
      this.presentToast('Psicólogo rechazado correctamente');
      this.modalController.dismiss(null, 'refresh');
    });
  }

  // Cierra el modal sin hacer cambios
  dismissModal() {
    this.modalController.dismiss();
  }

  // Muestra un toast con el mensaje indicado
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}