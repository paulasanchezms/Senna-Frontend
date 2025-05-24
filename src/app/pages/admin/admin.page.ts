import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { ModalController, ToastController } from '@ionic/angular';
import { UserResponseDTO } from 'src/app/models/user';
import { PsychologistProfileModalPage } from '../psychologist-profile-modal/psychologist-profile-modal.page';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  standalone: false,
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss']
})
export class AdminPage implements OnInit {

  selectedTab: string = 'pending';
  pendingPsychologists: UserResponseDTO[] = [];
  activeUsers: UserResponseDTO[] = [];
  loading: boolean = false;

  constructor(
    private adminService: AdminService,
    private toastController: ToastController,
    private router: Router,
    private modalController: ModalController,
    private authService: AuthService
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
    this.adminService.approvePsychologist(id).subscribe(() => {
      this.presentToast('Psicólogo aprobado');
      const approvedPsy = this.pendingPsychologists.find(p => p.id_user === id);
      if (approvedPsy) {
        this.activeUsers = [approvedPsy, ...this.activeUsers];
        this.pendingPsychologists = this.pendingPsychologists.filter(p => p.id_user !== id);
      }
    });
  }

  reject(id: number) {
    this.adminService.rejectPsychologist(id).subscribe(() => {
      this.presentToast('Psicólogo rechazado');
      this.pendingPsychologists = this.pendingPsychologists.filter(p => p.id_user !== id);
    });
  }

  ban(id: number) {
    this.adminService.banUser(id).subscribe(() => {
      this.presentToast('Usuario baneado');
      this.activeUsers = this.activeUsers.filter(user => user.id_user !== id);
    });
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
    toast.present();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}