import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuPatientPage } from './menu-patient.page';

describe('MenuPatientPage', () => {
  let component: MenuPatientPage;
  let fixture: ComponentFixture<MenuPatientPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuPatientPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
