import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DiaryService } from 'src/app/services/diary.service';

@Component({
  standalone: false,
  selector: 'app-register-day-modal',
  templateUrl: './register-day-modal.page.html',
  styleUrls: ['./register-day-modal.page.scss']
})
export class RegisterDayModalPage implements OnInit {
  @Input() selectedDate!: string;
  @Input() existingEntry: any;

  moods: any[] = [];
  symptoms: any[] = [];
  selectedMoodIds: number[] = [];
  selectedSymptomIds: number[] = [];
  notes: string = '';
  moodLevel: number = 3;

  constructor(
    private modalCtrl: ModalController,
    private diaryService: DiaryService
  ) {}

  ngOnInit() {
    // Cargar estados de ánimo
    this.diaryService.getMoods().subscribe({
      next: (data) => {
        this.moods = data;

        if (this.existingEntry?.moods) {
          this.selectedMoodIds = this.existingEntry.moods.map((m: any) => m.id);
        }
      },
      error: (err) => console.error('Error cargando moods:', err)
    });

    // Cargar síntomas
    this.diaryService.getSymptoms().subscribe({
      next: (data) => {
        this.symptoms = data;

        if (this.existingEntry?.symptoms) {
          this.selectedSymptomIds = this.existingEntry.symptoms.map((s: any) => s.id);
        }
      },
      error: (err) => console.error('Error cargando symptoms:', err)
    });

    // Cargar campos simples
    if (this.existingEntry) {
      this.notes = this.existingEntry.notes ?? '';
      this.moodLevel = this.existingEntry.moodLevel ?? 3;
    }
  }

  // Marca o desmarca un estado de ánimo
  toggleMood(id: number) {
    const index = this.selectedMoodIds.indexOf(id);
    if (index > -1) {
      this.selectedMoodIds.splice(index, 1);
    } else {
      this.selectedMoodIds.push(id);
    }
  }

  // Marca o desmarca un síntoma
  toggleSymptom(id: number) {
    const index = this.selectedSymptomIds.indexOf(id);
    if (index > -1) {
      this.selectedSymptomIds.splice(index, 1);
    } else {
      this.selectedSymptomIds.push(id);
    }
  }

  // Verifica si un estado de ánimo está seleccionado
  isSelectedMood(id: number): boolean {
    return this.selectedMoodIds.includes(id);
  }

  // Verifica si un síntoma está seleccionado
  isSelectedSymptom(id: number): boolean {
    return this.selectedSymptomIds.includes(id);
  }

  // Guarda la entrada diaria
  saveEntry() {
    const entry = {
      date: this.selectedDate,
      moodIds: this.selectedMoodIds,
      symptomIds: this.selectedSymptomIds,
      notes: this.notes,
      moodLevel: this.moodLevel
    };

    console.log('Enviando entrada al backend:', entry);

    this.diaryService.createEntry(entry).subscribe({
      next: () => {
        console.log('Registro guardado correctamente.');
        this.modalCtrl.dismiss(this.selectedDate, 'confirm');
      },
      error: (err) => {
        console.error('Error al guardar registro:', err);
        alert('Ocurrió un error al guardar el registro. Revisa la consola.');
      }
    });
  }

  // Cierra el modal sin guardar
  close() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}