import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearDeudaComponent } from './crear-deuda.component';

describe('CrearDeudaComponent', () => {
  let component: CrearDeudaComponent;
  let fixture: ComponentFixture<CrearDeudaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearDeudaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearDeudaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
