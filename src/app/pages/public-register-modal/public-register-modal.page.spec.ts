import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicRegisterModalPage } from './public-register-modal.page';

describe('PublicRegisterModalPage', () => {
  let component: PublicRegisterModalPage;
  let fixture: ComponentFixture<PublicRegisterModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicRegisterModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
