import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PsychologistProfilePage } from './psychologist-profile.page';

describe('PsychologistProfilePage', () => {
  let component: PsychologistProfilePage;
  let fixture: ComponentFixture<PsychologistProfilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PsychologistProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
