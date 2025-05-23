import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { Location } from '@angular/common';
import { ToastController } from '@ionic/angular';
import { UserResponseDTO } from 'src/app/models/user';

@Component({
  standalone:false,
  selector: 'app-psychologist-profile-modal',
  templateUrl: './psychologist-profile-modal.page.html',
  styleUrls: ['./psychologist-profile-modal.page.scss']
})
export class PsychologistProfileModalPage implements OnInit {

  psychologist!: UserResponseDTO;

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private toastController: ToastController,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit() {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state?.['psychologist']) {
      this.psychologist = nav.extras.state['psychologist'];
    } else {
      this.location.back();
    }
  }

  approve() {
    this.adminService.approvePsychologist(this.psychologist.id_user).subscribe(() => {
      this.presentToast('Psicólogo aprobado correctamente');
      this.location.back();
    });
  }

  reject() {
    this.adminService.rejectPsychologist(this.psychologist.id_user).subscribe(() => {
      this.presentToast('Psicólogo rechazado correctamente');
      this.location.back();
    });
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