import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { psychologistGuard } from './psychologist.guard';

describe('psychologistGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => psychologistGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
