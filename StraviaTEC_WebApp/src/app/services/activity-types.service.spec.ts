import { TestBed } from '@angular/core/testing';

import { ActivityTypesService } from './activity-types.service';

describe('ActivityTypesService', () => {
  let service: ActivityTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivityTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
