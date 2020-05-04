import { TestBed } from '@angular/core/testing';

import { EntradaPosteriorService } from './entrada-posterior.service';

describe('EntradaPosteriorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EntradaPosteriorService = TestBed.get(EntradaPosteriorService);
    expect(service).toBeTruthy();
  });
});
