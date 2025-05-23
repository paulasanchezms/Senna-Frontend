import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PsychologistProfileModalPage } from './psychologist-profile-modal.page';

describe('PsychologistProfileModalPage', () => {
  let component: PsychologistProfileModalPage;
  let fixture: ComponentFixture<PsychologistProfileModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PsychologistProfileModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
