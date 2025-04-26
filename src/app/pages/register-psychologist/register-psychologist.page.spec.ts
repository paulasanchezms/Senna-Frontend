import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterPsychologistPage } from './register-psychologist.page';

describe('RegisterPsychologistPage', () => {
  let component: RegisterPsychologistPage;
  let fixture: ComponentFixture<RegisterPsychologistPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterPsychologistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
