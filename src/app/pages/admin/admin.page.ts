import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { ModalController, ToastController } from '@ionic/angular';

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

  // Listas reactivas
  pendingPsychologists$ = new ReplaySubject<UserResponseDTO[]>(1);
  activeUsers$ = new ReplaySubject<UserResponseDTO[]>(1);

  constructor(
    private adminService: AdminService,
    private toastController: ToastController,
    private router: Router,
    private modalController: ModalController,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
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
        const filtered = res.filter(p =>
          p.profile?.specialty &&
          p.profile?.location &&
          p.profile?.description &&
          p.profile?.document
        );
        this.pendingPsychologists$.next([...filtered]);
        this.loading = false;
        this.cdr.detectChanges(); // opcional, para forzar render si necesario
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
        const filtered = res.filter(u => u.role !== 'ADMIN');
        this.activeUsers$.next([...filtered]);
        this.cdr.detectChanges(); // opcional
      },
      error: () => {
        this.presentToast('Error al cargar usuarios activos');
      }
    });
  }

  approve(id: number) {
    this.adminService.approvePsychologist(id).subscribe(() => {
      this.presentToast('Psicólogo aprobado');

      this.pendingPsychologists$.subscribe(pending => {
        this.activeUsers$.subscribe(active => {
          const approved = pending.find(p => p.id_user === id);
          if (approved) {
            const newPending = pending.filter(p => p.id_user !== id);
            const newActive = [approved, ...active];
            this.pendingPsychologists$.next([...newPending]);
            this.activeUsers$.next([...newActive]);
            this.cdr.detectChanges();
          }
        }).unsubscribe();
      }).unsubscribe();
    });
  }

  reject(id: number) {
    this.adminService.rejectPsychologist(id).subscribe(() => {
      this.presentToast('Psicólogo rechazado');
      this.pendingPsychologists$.subscribe(current => {
        const updated = current.filter(p => p.id_user !== id);
        this.pendingPsychologists$.next([...updated]);
        this.cdr.detectChanges();
      }).unsubscribe();
    });
  }

  ban(id: number) {
    this.adminService.banUser(id).subscribe(() => {
      this.presentToast('Usuario baneado');
      this.activeUsers$.subscribe(current => {
        const updated = current.filter(u => u.id_user !== id);
        this.activeUsers$.next([...updated]);
        this.cdr.detectChanges();
      }).unsubscribe();
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
    await toast.present();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}