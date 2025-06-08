import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserResponseDTO } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  standalone: false,
  selector: 'app-patient-profile',
  templateUrl: './patient-profile.page.html',
})
export class PatientProfilePage implements OnInit {
  user!: UserResponseDTO;
  previewUrl: string | null = null;
  photoTempUrl: string | null = null;
  form!: FormGroup;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private fb: FormBuilder 
  ) {}

  ngOnInit() {
    // Se construye el formulario con validaciones
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]],
      last_name: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]],
      phone: ['', [Validators.pattern(/^[0-9]{9,15}$/)]], 
    });
    // Se cargan los datos del usuario desde el backend y se rellena el formulario  
    this.userService.me().subscribe({
      next: (data) => {
        this.user = data;
        this.previewUrl = data.photoUrl ?? null;
        this.form.patchValue({
          name: data.name || '',
          last_name: data.last_name || '',
          phone: data.phone || ''
        });
      },
      error: (err) => console.error('Error cargando perfil', err),
    });
  }

  // Método que se ejecuta cuando el usuario selecciona una imagen
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

  // Guardar cambios del formulario
  saveChanges() {
    if (this.form.invalid) {
      this.presentToast('Revisa los datos del formulario.', 'danger');
      return;
    }
  
    const updateData: any = {
      ...this.form.value,
      photoUrl: this.photoTempUrl ?? this.user.photoUrl,
    };
  
    this.userService.updateMe(updateData).subscribe({
      next: () => {
        this.user = { ...this.user, ...updateData };
        this.photoTempUrl = null;
        this.presentToast('Perfil actualizado correctamente.', 'success');
      },
      error: (err) => {
        console.error('Error actualizando perfil:', err);
        this.presentToast('No se pudieron guardar los cambios.', 'danger');
      }
    });
  }

  // Cierra sesión del usuario
  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }

  // Muestra un toast informativo en la pantalla
  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      position: 'bottom',
      color,
    });
    await toast.present();
  }

  // Previene la introducción de caracteres no numéricos en el campo de teléfono
  preventInvalidKeyPress(event: KeyboardEvent) {
    const allowed = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'];
    const isNumber = /^[0-9]$/.test(event.key);
    if (!isNumber && !allowed.includes(event.key)) {
      event.preventDefault();
    }
  }
}
