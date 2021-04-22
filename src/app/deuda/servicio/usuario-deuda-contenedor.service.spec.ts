import { TestBed } from '@angular/core/testing';

import { UsuarioDeudaContenedorService } from './usuario-deuda-contenedor.service';

describe('UsuarioDeudaContenedorService', () => {
  let service: UsuarioDeudaContenedorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioDeudaContenedorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
