import { TestBed } from '@angular/core/testing';

import { UpdatePostByIdSubService } from './update-post-by-id-sub.service';

describe('UpdatepostByIdSubService', () => {
  let service: UpdatePostByIdSubService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdatePostByIdSubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
