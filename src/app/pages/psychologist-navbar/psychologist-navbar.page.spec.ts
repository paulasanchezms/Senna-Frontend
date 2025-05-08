import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PsychologistNavbarPage } from './psychologist-navbar.page';

describe('PsychologistNavbarPage', () => {
  let component: PsychologistNavbarPage;
  let fixture: ComponentFixture<PsychologistNavbarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PsychologistNavbarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
