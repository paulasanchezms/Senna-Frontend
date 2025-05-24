import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  standalone:false,
  selector: 'app-terms-psychologist',
  templateUrl: './terms-psychologist.page.html',
  styleUrls: ['./terms-psychologist.page.scss'],
})
export class TermsPsychologistPage {
  constructor(private modalController: ModalController) {}

  dismissModal() {
    this.modalController.dismiss();
  }
}