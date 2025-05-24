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

  approve() {
    this.adminService.approvePsychologist(this.psychologist.id_user).subscribe(() => {
      this.presentToast('Psicólogo aprobado correctamente');
      this.modalController.dismiss(null, 'refresh');
    });
  }

  reject() {
    this.adminService.rejectPsychologist(this.psychologist.id_user).subscribe(() => {
      this.presentToast('Psicólogo rechazado correctamente');
      this.modalController.dismiss(null, 'refresh');
    });
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}