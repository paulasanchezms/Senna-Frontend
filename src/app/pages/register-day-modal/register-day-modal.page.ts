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

  moods: any[] = [];
  symptoms: any[] = [];
  selectedMoodIds: number[] = [];
  selectedSymptomIds: number[] = [];
  notes: string = '';

  constructor(
    private modalCtrl: ModalController,
    private diaryService: DiaryService
  ) {}

@Input() existingEntry: any; 

ngOnInit() {
  this.diaryService.getMoods().subscribe(data => {
    this.moods = data;

    // Si hay datos previos, marca los seleccionados
    if (this.existingEntry) {
      this.selectedMoodIds = this.existingEntry.mood.map((m: any) => m.id);
    }
  });

  this.diaryService.getSymptoms().subscribe(data => {
    this.symptoms = data;

    if (this.existingEntry) {
      this.selectedSymptomIds = this.existingEntry.symptoms.map((s: any) => s.id);
    }
  });

  if (this.existingEntry) {
    this.notes = this.existingEntry.notes;
  }
}

  toggleMood(id: number) {
    const index = this.selectedMoodIds.indexOf(id);
    if (index > -1) {
      this.selectedMoodIds.splice(index, 1);
    } else {
      this.selectedMoodIds.push(id);
    }
  }

  toggleSymptom(id: number) {
    const index = this.selectedSymptomIds.indexOf(id);
    if (index > -1) {
      this.selectedSymptomIds.splice(index, 1);
    } else {
      this.selectedSymptomIds.push(id);
    }
  }

  isSelectedMood(id: number): boolean {
    return this.selectedMoodIds.includes(id);
  }

  isSelectedSymptom(id: number): boolean {
    return this.selectedSymptomIds.includes(id);
  }

  saveEntry() {
    const entry = {
      date: this.selectedDate,
      moodIds: this.selectedMoodIds,
      symptomIds: this.selectedSymptomIds,
      notes: this.notes
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

  close() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}