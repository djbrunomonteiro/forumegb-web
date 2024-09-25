import { TestBed } from '@angular/core/testing';

import { MetadataStoreService } from './metadata-store.service';

describe('MetadataStoreService', () => {
  let service: MetadataStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetadataStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
