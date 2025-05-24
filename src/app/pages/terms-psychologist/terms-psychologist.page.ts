import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ToastController } from '@ionic/angular';

@Component({
  standalone:false,
  selector: 'app-terms-psychologist',
  templateUrl: './terms-psychologist.page.html',
  styleUrls: ['./terms-psychologist.page.scss'],
})
export class TermsPsychologistPage {

  constructor(
    private userService: UserService,
    private router: Router,
    private toastController: ToastController
  ) {}

  async acceptTerms() {
    this.userService.acceptTerms().subscribe({
      next: async () => {
        const toast = await this.toastController.create({
          message: 'Términos aceptados correctamente.',
          duration: 2000,
          color: 'success'
        });
        toast.present();
        this.router.navigate(['/psychologist-profile']);
      },
      error: async () => {
        const toast = await this.toastController.create({
          message: 'Error al aceptar los términos.',
          duration: 2000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }
}