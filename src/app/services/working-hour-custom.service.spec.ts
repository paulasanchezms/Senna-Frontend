import { TestBed } from '@angular/core/testing';

import { WorkingHourCustomService } from './working-hour-custom.service';

describe('WorkingHourCustomService', () => {
  let service: WorkingHourCustomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkingHourCustomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
