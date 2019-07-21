import { TestBed } from '@angular/core/testing';

import { AcessoComumService } from './acesso-comum.service';

describe('AcessoComumService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AcessoComumService = TestBed.get(AcessoComumService);
    expect(service).toBeTruthy();
  });
});
