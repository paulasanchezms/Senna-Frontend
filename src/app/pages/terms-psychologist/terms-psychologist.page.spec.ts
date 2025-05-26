import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TermsPsychologistPage } from './terms-psychologist.page';

describe('TermsPsychologistPage', () => {
  let component: TermsPsychologistPage;
  let fixture: ComponentFixture<TermsPsychologistPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsPsychologistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
