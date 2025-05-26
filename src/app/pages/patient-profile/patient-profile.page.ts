import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserResponseDTO } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  standalone: false,
  selector: 'app-patient-profile',
  templateUrl: './patient-profile.page.html',
})
export class PatientProfilePage implements OnInit {
  user!: UserResponseDTO;
  previewUrl: string | null = null;
  photoTempUrl: string | null = null;

  constructor(private userService: UserService,private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.userService.me().subscribe({
      next: data => this.user = data,
      error: err => console.error('Error cargando perfil', err)
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    this.previewUrl = URL.createObjectURL(file);

    this.userService.uploadToImgBB(file).subscribe({
      next: (url) => {
        this.photoTempUrl = url; // guardamos la url temporal para enviarla luego en el saveChanges
      },
      error: (err) => {
        console.error('Error subiendo imagen:', err);
        alert('Hubo un problema al subir la imagen.');
        this.previewUrl = null;
      }
    });
  }

  saveChanges() {
    const updateData: any = {
      name: this.user.name,
      last_name: this.user.last_name,
      phone: this.user.phone,
    };

    // Añadir photoUrl si se ha actualizado
    if (this.photoTempUrl) {
      updateData.photoUrl = this.photoTempUrl;
    }

    this.userService.updateMe(updateData).subscribe({
      next: () => {
        if (this.photoTempUrl) {
          this.user.photoUrl = this.photoTempUrl;
          this.photoTempUrl = null;
        }
        alert('Perfil actualizado correctamente');
      },
      error: err => {
        console.error('Error actualizando perfil:', err);
        alert('No se pudieron guardar los cambios.');
      }
    });
  }

  logout() {
    this.authService.logout();
    window.location.href = '/login';
    }
}