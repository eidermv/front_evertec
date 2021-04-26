import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarDeudaComponent } from './consultar-deuda.component';

describe('ConsultarDeudaComponent', () => {
  let component: ConsultarDeudaComponent;
  let fixture: ComponentFixture<ConsultarDeudaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultarDeudaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarDeudaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
