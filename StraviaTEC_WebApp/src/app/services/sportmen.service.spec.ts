import { TestBed } from '@angular/core/testing';

import { SportmenService } from './sportmen.service';

describe('SportmanService', () => {
  let service: SportmenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SportmenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
