import { TestBed } from '@angular/core/testing';

import { WeaterMeteoService } from './weater-meteo.service';

describe('WeaterMeteoService', () => {
  let service: WeaterMeteoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeaterMeteoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
