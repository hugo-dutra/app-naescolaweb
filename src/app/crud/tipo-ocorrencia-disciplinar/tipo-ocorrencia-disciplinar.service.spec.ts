import { TestBed } from '@angular/core/testing';

import { TipoOcorrenciaDisciplinarService } from './tipo-ocorrencia-disciplinar.service';

describe('TipoOcorrenciaDisciplinarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TipoOcorrenciaDisciplinarService = TestBed.get(TipoOcorrenciaDisciplinarService);
    expect(service).toBeTruthy();
  });
});
