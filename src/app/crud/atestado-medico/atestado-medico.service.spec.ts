import { TestBed } from '@angular/core/testing';

import { AtestadoMedicoService } from './atestado-medico.service';

describe('AtestadoMedicoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AtestadoMedicoService = TestBed.get(AtestadoMedicoService);
    expect(service).toBeTruthy();
  });
});
