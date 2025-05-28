import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserResponseDTO } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Component({
  standalone: false,
  selector: 'app-patient-profile',
  templateUrl: './patient-profile.page.html',
})
export class PatientProfilePage implements OnInit {
  user!: UserResponseDTO;
  previewUrl: string | null = null;
  photoTempUrl: string | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.userService.me().subscribe({
      next: (data) => (this.user = data),
      error: (err) => console.error('Error cargando perfil', err),
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    this.previewUrl = URL.createObjectURL(file);

    this.userService.uploadToImgBB(file).subscribe({
      next: (url) => {
        this.photoTempUrl = url;
      },
      error: (err) => {
        console.error('Error subiendo imagen:', err);
        this.alertCtrl
          .create({
            header: 'Error',
            message: 'Hubo un problema al subir la imagen. Inténtalo de nuevo.',
            buttons: ['Aceptar'],
          })
          .then((alert) => alert.present());

        this.previewUrl = null;
      },
    });
  }

  saveChanges() {
  const updateData: any = {
    name: this.user.name,
    last_name: this.user.last_name,
    phone: this.user.phone,
  };

  // Añadir foto si fue actualizada
  if (this.photoTempUrl) {
    updateData.photoUrl = this.photoTempUrl;
  }

  this.userService.updateMe(updateData).subscribe({
    next: () => {
      // Actualizar localmente la foto si fue cambiada
      if (this.photoTempUrl) {
        this.user.photoUrl = this.photoTempUrl;
        this.photoTempUrl = null;
      }

      this.presentToast('Perfil actualizado correctamente.', 'success');
    },
    error: (err) => {
      console.error('Error actualizando perfil:', err);
      this.presentToast('No se pudieron guardar los cambios.', 'danger');
    }
  });
}

  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      position: 'bottom',
      color,
    });
    await toast.present();
  }
}
