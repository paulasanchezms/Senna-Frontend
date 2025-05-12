import { TestBed } from '@angular/core/testing';

import { PsychologistProfileService } from './psychologist-profile.service';

describe('PsychologistProfileService', () => {
  let service: PsychologistProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PsychologistProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
