import { TestBed } from '@angular/core/testing';

import { Csv } from './csv';

describe('Csv', () => {
  let service: Csv;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Csv);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
