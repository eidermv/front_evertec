import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarDeudaComponent } from './editar-deuda.component';

describe('EditarDeudaComponent', () => {
  let component: EditarDeudaComponent;
  let fixture: ComponentFixture<EditarDeudaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarDeudaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarDeudaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
