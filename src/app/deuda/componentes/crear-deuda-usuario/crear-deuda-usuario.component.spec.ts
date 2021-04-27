import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearDeudaUsuarioComponent } from './crear-deuda-usuario.component';

describe('CrearDeudaUsuarioComponent', () => {
  let component: CrearDeudaUsuarioComponent;
  let fixture: ComponentFixture<CrearDeudaUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearDeudaUsuarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearDeudaUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
