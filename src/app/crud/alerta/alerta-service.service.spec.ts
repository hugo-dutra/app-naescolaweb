import { TestBed } from '@angular/core/testing';

import { AlertaServiceService } from './alerta-service.service';

describe('AlertaServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlertaServiceService = TestBed.get(AlertaServiceService);
    expect(service).toBeTruthy();
  });
});
