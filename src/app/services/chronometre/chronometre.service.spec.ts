import { TestBed } from '@angular/core/testing';

import { ChronometreService } from './chronometre.service';

describe('ChronometreService', () => {
  let service: ChronometreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChronometreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
