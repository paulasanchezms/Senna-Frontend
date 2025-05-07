import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeeklySchedulePage } from './weekly-schedule.page';

describe('WeeklySchedulePage', () => {
  let component: WeeklySchedulePage;
  let fixture: ComponentFixture<WeeklySchedulePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklySchedulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
