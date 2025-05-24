import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  standalone:false,
  selector: 'app-terms-patient',
  templateUrl: './terms-patient.page.html',
  styleUrls: ['./terms-patient.page.scss'],
})
export class TermsPatientPage {

  constructor(private modalController: ModalController) {}

  dismissModal() {
    this.modalController.dismiss();
  }

}
