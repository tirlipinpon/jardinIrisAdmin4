import { TestBed } from '@angular/core/testing';

import { TheNewsApiService } from './the-news-api.service';

describe('TheNewsApiService', () => {
  let service: TheNewsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TheNewsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
