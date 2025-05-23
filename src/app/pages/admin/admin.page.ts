import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { ModalController, ToastController } from '@ionic/angular';
import { UserResponseDTO } from 'src/app/models/user';
import { PsychologistProfileModalPage } from '../psychologist-profile-modal/psychologist-profile-modal.page';

@Component({
  standalone:false,
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
    private modalController: ModalController 

  ) {}

  ngOnInit() {
    this.loadPendingPsychologists();
    this.loadActiveUsers();
  }

  loadPendingPsychologists() {
    this.loading = true;
    this.adminService.getPendingPsychologists().subscribe({
      next: (res) => {
        this.pendingPsychologists = res;
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
      this.loadPendingPsychologists();
      this.loadActiveUsers();
    });
  }

  reject(id: number) {
    this.adminService.rejectPsychologist(id).subscribe(() => {
      this.presentToast('Psicólogo rechazado');
      this.loadPendingPsychologists();
    });
  }

  ban(id: number) {
    this.adminService.banUser(id).subscribe(() => {
      this.presentToast('Usuario baneado');
      this.loadActiveUsers();
    });
  }

  async viewProfile(psychologist: UserResponseDTO) {
    const modal = await this.modalController.create({
      component: PsychologistProfileModalPage,
      componentProps: {
        psychologist
      }
    });
    await modal.present();
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
