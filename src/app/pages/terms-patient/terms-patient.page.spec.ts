import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TermsPatientPage } from './terms-patient.page';

describe('TermsPatientPage', () => {
  let component: TermsPatientPage;
  let fixture: ComponentFixture<TermsPatientPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsPatientPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
