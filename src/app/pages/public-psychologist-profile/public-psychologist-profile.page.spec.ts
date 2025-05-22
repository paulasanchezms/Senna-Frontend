import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicPsychologistProfilePage } from './public-psychologist-profile.page';

describe('PublicPsychologistProfilePage', () => {
  let component: PublicPsychologistProfilePage;
  let fixture: ComponentFixture<PublicPsychologistProfilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicPsychologistProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
