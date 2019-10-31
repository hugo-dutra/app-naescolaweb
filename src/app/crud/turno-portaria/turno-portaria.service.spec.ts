import { TestBed } from '@angular/core/testing';

import { TurnoPortariaService } from './turno-portaria.service';

describe('TurnoPortariaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TurnoPortariaService = TestBed.get(TurnoPortariaService);
    expect(service).toBeTruthy();
  });
});
