import { TestBed } from '@angular/core/testing';

import { UsuarioDeudaService } from './usuario-deuda.service';

describe('UsuarioDeudaService', () => {
  let service: UsuarioDeudaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioDeudaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
