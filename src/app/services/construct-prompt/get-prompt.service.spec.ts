import { TestBed } from '@angular/core/testing';

import { GetPromptService } from './get-prompt.service';

describe('GetPrompService', () => {
  let service: GetPromptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetPromptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
