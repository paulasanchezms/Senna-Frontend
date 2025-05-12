import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientTabsPage } from './patient-tabs.page';

describe('PatientTabsPage', () => {
  let component: PatientTabsPage;
  let fixture: ComponentFixture<PatientTabsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientTabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
