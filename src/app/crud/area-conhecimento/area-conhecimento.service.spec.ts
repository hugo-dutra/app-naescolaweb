import { TestBed } from '@angular/core/testing';

import { AreaConhecimentoService } from './area-conhecimento.service';

describe('AreaConhecimentoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AreaConhecimentoService = TestBed.get(AreaConhecimentoService);
    expect(service).toBeTruthy();
  });
});
