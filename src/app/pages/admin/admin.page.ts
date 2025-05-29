import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
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

  // Subjects para los async pipes
  pendingPsychologists$ = new ReplaySubject<UserResponseDTO[]>(1);
  activeUsers$ = new ReplaySubject<UserResponseDTO[]>(1);

  // Copias locales para manipulación de datos
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
        this.pendingPsychologists$.next([...this.pendingPsychologists]);
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
        this.activeUsers$.next([...this.activeUsers]);
      },
      error: () => {
        this.presentToast('Error al cargar usuarios activos');
      }
    });
  }

  approve(id: number) {
    this.adminService.approvePsychologist(id).subscribe(() => {
      this.presentToast('Psicólogo aprobado');
      const approved = this.pendingPsychologists.find(p => p.id_user === id);
      if (approved) {
        this.pendingPsychologists = this.pendingPsychologists.filter(p => p.id_user !== id);
        this.activeUsers = [approved, ...this.activeUsers];
        this.pendingPsychologists$.next([...this.pendingPsychologists]);
        this.activeUsers$.next([...this.activeUsers]);
      }
    });
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
    this.adminService.rejectPsychologist(id).subscribe(() => {
      this.presentToast('Psicólogo rechazado');
      this.pendingPsychologists = this.pendingPsychologists.filter(p => p.id_user !== id);
      this.pendingPsychologists$.next([...this.pendingPsychologists]);
    });
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
    this.adminService.banUser(id).subscribe(() => {
      this.presentToast('Usuario baneado');
      this.activeUsers = this.activeUsers.filter(u => u.id_user !== id);
      this.activeUsers$.next([...this.activeUsers]);
    });
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
}