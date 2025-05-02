import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterDayModalPage } from './register-day-modal.page';

describe('RegisterDayModalPage', () => {
  let component: RegisterDayModalPage;
  let fixture: ComponentFixture<RegisterDayModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterDayModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
