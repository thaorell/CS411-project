import { TestBed, inject } from '@angular/core/testing';

import { TripServiceService } from './trip-service.service';

describe('TripServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TripServiceService]
    });
  });

  it('should be created', inject([TripServiceService], (service: TripServiceService) => {
    expect(service).toBeTruthy();
  }));
});
