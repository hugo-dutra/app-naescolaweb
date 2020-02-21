import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarAtestadoMedicoComponent } from './listar-atestado-medico.component';

describe('ListarAtestadoMedicoComponent', () => {
  let component: ListarAtestadoMedicoComponent;
  let fixture: ComponentFixture<ListarAtestadoMedicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarAtestadoMedicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarAtestadoMedicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
