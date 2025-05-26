import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicPatientProfilePage } from './public-patient-profile.page';

describe('PublicPatientProfilePage', () => {
  let component: PublicPatientProfilePage;
  let fixture: ComponentFixture<PublicPatientProfilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicPatientProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
