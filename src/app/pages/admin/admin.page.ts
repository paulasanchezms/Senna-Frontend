import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ModalController,
  ToastController,
  AlertController,
} from '@ionic/angular';

import { AdminService } from '../../services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserResponseDTO } from 'src/app/models/user';
import { PsychologistProfileModalPage } from '../psychologist-profile-modal/psychologist-profile-modal.page';

@Component({
  standalone: false,
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  selectedTab: string = 'pending';
  loading: boolean = false;

  pendingPsychologists: UserResponseDTO[] = [];
  activeUsers: UserResponseDTO[] = [];

  constructor(
    private adminService: AdminService,
    private toastController: ToastController,
    private router: Router,
    private modalController: ModalController,
    private authService: AuthService,
    private alertCtrl: AlertController
  ) {}

  // Carga inicial de datos al entrar a la página
  ngOnInit() {
    this.loadAllData();
  }

  // Carga todos los datos necesarios: pendientes y activos
  loadAllData() {
    this.loadPendingPsychologists();
    this.loadActiveUsers();
  }

  // Carga psicólogos con solicitud pendiente que tengan su perfil completo
  loadPendingPsychologists() {
    this.loading = true;
    this.adminService.getPendingPsychologists().subscribe({
      next: (res) => {
        this.pendingPsychologists = res.filter(
          (p) =>
            p.profile?.specialty &&
            p.profile?.location &&
            p.profile?.description &&
            p.profile?.document
        );
        this.loading = false;
      },
      error: () => {
        this.presentToast('Error al cargar psicólogos pendientes');
        this.loading = false;
      },
    });
  }

  // Carga todos los usuarios activos (excluyendo administradores)
  loadActiveUsers() {
    this.adminService.getAllActiveUsers().subscribe({
      next: (res) => {
        this.activeUsers = res.filter((u) => u.role !== 'ADMIN');
      },
      error: () => {
        this.presentToast('Error al cargar usuarios activos');
      },
    });
  }

  // Aprueba a un psicólogo pendiente y actualiza la interfaz
  approve(id: number) {
    this.adminService.approvePsychologist(id).subscribe({
      next: () => {
        this.presentToast('Psicólogo aprobado');
        this.updateUIAfterApproval(id);
      },
      error: (error) => {
        console.error('Error en approve:', error);

        setTimeout(() => {
          this.loadAllData();
        }, 1000);

        this.presentToast('Verificando estado de la solicitud...');
      },
    });
  }

  // Actualiza la lista local tras aprobar
  private updateUIAfterApproval(id: number) {
    const approvedPsychologist = this.pendingPsychologists.find(
      (p) => p.id_user === id
    );

    if (approvedPsychologist) {
      this.pendingPsychologists = this.pendingPsychologists.filter(
        (p) => p.id_user !== id
      );

      const existsInActive = this.activeUsers.some((u) => u.id_user === id);
      if (!existsInActive) {
        this.activeUsers.push(approvedPsychologist);
      }
    }
  }

  // Alerta de confirmación para aprobar
  confirmApprove(id: number) {
    this.alertCtrl
      .create({
        header: 'Aprobar psicólogo',
        message: '¿Estás seguro/a de que quieres aprobar a este profesional?',
        buttons: [
          { text: 'Cancelar', role: 'cancel' },
          {
            text: 'Sí, aprobar',
            handler: () => this.approve(id),
          },
        ],
      })
      .then((alert) => alert.present());
  }

  // Rechaza a un psicólogo y actualiza la lista
  reject(id: number) {
    this.adminService.rejectPsychologist(id).subscribe({
      next: () => {
        this.presentToast('Psicólogo rechazado');
        this.updateUIAfterRejection(id);
      },
      error: (error) => {
        console.error('Error en reject:', error);

        setTimeout(() => {
          this.loadPendingPsychologists();
        }, 1000);

        this.presentToast('Verificando estado de la solicitud...');
      },
    });
  }

  // Actualiza la lista local tras rechazar
  private updateUIAfterRejection(id: number) {
    this.pendingPsychologists = this.pendingPsychologists.filter(
      (p) => p.id_user !== id
    );
  }

  // Alerta de confirmación para rechazar
  confirmReject(id: number) {
    this.alertCtrl
      .create({
        header: 'Rechazar psicólogo',
        message: '¿Seguro que quieres rechazar esta solicitud?',
        buttons: [
          { text: 'Cancelar', role: 'cancel' },
          {
            text: 'Sí, rechazar',
            handler: () => this.reject(id),
          },
        ],
      })
      .then((alert) => alert.present());
  }

  // Banea a un usuario activo
  ban(id: number) {
    this.adminService.banUser(id).subscribe({
      next: () => {
        this.presentToast('Usuario baneado');
        this.updateUIAfterBan(id);
      },
      error: (error) => {
        console.error('Error en ban:', error);

        // Verificar si realmente se baneó recargando los datos
        setTimeout(() => {
          this.loadActiveUsers();
        }, 1000);

        this.presentToast('Verificando estado del usuario...');
      },
    });
  }

  // Actualiza la lista local tras banear
  private updateUIAfterBan(id: number) {
    this.activeUsers = this.activeUsers.filter((u) => u.id_user !== id);
  }

  // Alerta de confirmación para banear
  confirmBan(id: number) {
    this.alertCtrl
      .create({
        header: 'Banear usuario',
        message:
          '¿Estás seguro/a de que quieres banear permanentemente a este usuario?',
        buttons: [
          { text: 'Cancelar', role: 'cancel' },
          {
            text: 'Sí, banear',
            handler: () => this.ban(id),
          },
        ],
      })
      .then((alert) => alert.present());
  }

  // Abre el modal con el perfil del psicólogo
  async viewProfile(psychologist: UserResponseDTO) {
    const modal = await this.modalController.create({
      component: PsychologistProfileModalPage,
      componentProps: { psychologist },
    });

    await modal.present();

    const { role } = await modal.onDidDismiss();
    if (role === 'refresh') {
      this.loadAllData();
    }
  }

  // Muestra un toast con mensaje
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
  }

  // Cierra la sesión
  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }

  // Para trackear los usuarios en la plantilla de manera eficiente
  trackById(index: number, item: UserResponseDTO): number {
    return item.id_user;
  }
}
