import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ToastController, AlertController } from '@ionic/angular';

import { AdminService } from '../../services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserResponseDTO } from 'src/app/models/user';
import { PsychologistProfileModalPage } from '../psychologist-profile-modal/psychologist-profile-modal.page';

@Component({
  standalone: false,
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss']
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

  ngOnInit() {
    this.loadAllData();
  }

  loadAllData() {
    this.loadPendingPsychologists();
    this.loadActiveUsers();
  }

  loadPendingPsychologists() {
    this.loading = true;
    this.adminService.getPendingPsychologists().subscribe({
      next: (res) => {
        this.pendingPsychologists = res.filter(p =>
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
      }
    });
  }

  loadActiveUsers() {
    this.adminService.getAllActiveUsers().subscribe({
      next: (res) => {
        this.activeUsers = res.filter(u => u.role !== 'ADMIN');
      },
      error: () => {
        this.presentToast('Error al cargar usuarios activos');
      }
    });
  }

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
      }
    });
  }

  // Método auxiliar para actualizar la UI después de aprobar
  private updateUIAfterApproval(id: number) {
    // Encontrar el psicólogo aprobado
    const approvedPsychologist = this.pendingPsychologists.find(p => p.id_user === id);
    
    if (approvedPsychologist) {
      // Remover de pendientes
      this.pendingPsychologists = this.pendingPsychologists.filter(p => p.id_user !== id);
      
      // Agregar a activos
      const existsInActive = this.activeUsers.some(u => u.id_user === id);
      if (!existsInActive) {
        this.activeUsers.push(approvedPsychologist);
      }
    }
  }

  confirmApprove(id: number) {
    this.alertCtrl.create({
      header: 'Aprobar psicólogo',
      message: '¿Estás seguro/a de que quieres aprobar a este profesional?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Sí, aprobar',
          handler: () => this.approve(id)
        }
      ]
    }).then(alert => alert.present());
  }

  reject(id: number) {
    this.adminService.rejectPsychologist(id).subscribe({
      next: () => {
        this.presentToast('Psicólogo rechazado');
        this.updateUIAfterRejection(id);
      },
      error: (error) => {
        console.error('Error en reject:', error);
        
        // Verificar si realmente se rechazó recargando los datos
        setTimeout(() => {
          this.loadPendingPsychologists();
        }, 1000);
        
        this.presentToast('Verificando estado de la solicitud...');
      }
    });
  }

  // Método auxiliar para actualizar la UI después de rechazar
  private updateUIAfterRejection(id: number) {
    // Remover de la lista de pendientes inmediatamente
    this.pendingPsychologists = this.pendingPsychologists.filter(p => p.id_user !== id);
  }

  confirmReject(id: number) {
    this.alertCtrl.create({
      header: 'Rechazar psicólogo',
      message: '¿Seguro que quieres rechazar esta solicitud?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Sí, rechazar',
          handler: () => this.reject(id)
        }
      ]
    }).then(alert => alert.present());
  }

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
      }
    });
  }

  // Método auxiliar para actualizar la UI después de banear
  private updateUIAfterBan(id: number) {
    // Remover de la lista de activos inmediatamente
    this.activeUsers = this.activeUsers.filter(u => u.id_user !== id);
  }

  confirmBan(id: number) {
    this.alertCtrl.create({
      header: 'Banear usuario',
      message: '¿Estás seguro/a de que quieres banear permanentemente a este usuario?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Sí, banear',
          handler: () => this.ban(id)
        }
      ]
    }).then(alert => alert.present());
  }

  async viewProfile(psychologist: UserResponseDTO) {
    const modal = await this.modalController.create({
      component: PsychologistProfileModalPage,
      componentProps: { psychologist }
    });

    await modal.present();

    const { role } = await modal.onDidDismiss();
    if (role === 'refresh') {
      this.loadAllData();
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }

  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }

  trackById(index: number, item: UserResponseDTO): number {
    return item.id_user;
  }
}