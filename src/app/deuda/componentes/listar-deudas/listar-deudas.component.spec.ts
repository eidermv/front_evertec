import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarDeudasComponent } from './listar-deudas.component';

describe('ListarDeudasComponent', () => {
  let component: ListarDeudasComponent;
  let fixture: ComponentFixture<ListarDeudasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarDeudasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarDeudasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
