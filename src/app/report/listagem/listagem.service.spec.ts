import { TestBed } from '@angular/core/testing';

import { ListagemService } from './listagem.service';

describe('ListagemService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ListagemService = TestBed.get(ListagemService);
    expect(service).toBeTruthy();
  });
});
