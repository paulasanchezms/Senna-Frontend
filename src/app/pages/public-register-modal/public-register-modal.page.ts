import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DiaryService, DiaryEntryResponseDTO } from 'src/app/services/diary.service';

@Component({
  selector: 'app-public-register-modal',
  templateUrl: './public-register-modal.page.html',
  styleUrls: ['./public-register-modal.page.scss'],
  standalone: false
})
export class PublicRegisterModalPage implements OnInit {
  @Input() selectedDate!: string;
  @Input() patientId!: number;

  entry?: DiaryEntryResponseDTO;
  moods: any[] = [];
  symptoms: any[] = [];
  notes: string = '';
  moodLevel: number = 3;
  isLoading = true;

  constructor(
    private modalCtrl: ModalController,
    private diaryService: DiaryService
  ) {}

  ngOnInit() {
    this.diaryService.getEntryForPatientByDate(this.patientId, this.selectedDate).subscribe({
      next: (data) => {
        const entry = Array.isArray(data) ? data.find(e => e.date === this.selectedDate) : data;
        
        if (!entry) {
          console.warn('No se encontró entrada para la fecha', this.selectedDate);
          this.isLoading = false;
          return;
        }
    
        this.entry = entry;
        this.moods = entry.moods || [];
        this.symptoms = entry.symptoms || [];
        this.notes = entry.notes || '';
        this.moodLevel = entry.moodLevel || 3;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando entrada:', err);
        this.isLoading = false;
      }
    });
  }

  // Devuelve true si un estado emocional (mood) está seleccionado
  isSelectedMood(id: number): boolean {
    return this.moods.some(m => m.id === id);
  }

  // Devuelve true si un síntoma está seleccionado
  isSelectedSymptom(id: number): boolean {
    return this.symptoms.some(s => s.id === id);
  }

  // Cierra el modal sin realizar ninguna acción
  close() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}