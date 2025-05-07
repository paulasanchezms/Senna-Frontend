import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkingHourModalPage } from './working-hour-modal.page';

describe('WorkingHourModalPage', () => {
  let component: WorkingHourModalPage;
  let fixture: ComponentFixture<WorkingHourModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingHourModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
