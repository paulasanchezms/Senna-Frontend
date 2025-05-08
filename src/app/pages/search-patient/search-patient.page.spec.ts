import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchPatientPage } from './search-patient.page';

describe('SearchPatientPage', () => {
  let component: SearchPatientPage;
  let fixture: ComponentFixture<SearchPatientPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPatientPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
