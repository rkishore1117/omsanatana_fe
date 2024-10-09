import { TestBed } from '@angular/core/testing';

import { ReligiousService } from './religious.service';

describe('ReligiousService', () => {
  let service: ReligiousService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReligiousService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
