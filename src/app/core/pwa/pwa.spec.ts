import { TestBed } from '@angular/core/testing';
import PwaService from './pwa';

describe('Pwa', () => {
  let service: PwaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PwaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
