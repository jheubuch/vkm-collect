import { TestBed } from '@angular/core/testing';

import { VkmService } from './vkm';

describe('Csv', () => {
  let service: VkmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VkmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
