import { TestBed, inject } from '@angular/core/testing';

import { YelpService } from './yelp-service.service';

describe('YelpServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [YelpService]
    });
  });

  it('should be created', inject([YelpService], (service: YelpService) => {
    expect(service).toBeTruthy();
  }));
});
