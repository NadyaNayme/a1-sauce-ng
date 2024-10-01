import { TestBed } from '@angular/core/testing';

import { LogErrorService } from './log-error.service';

describe('LogErrorService', () => {
  let service: LogErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
