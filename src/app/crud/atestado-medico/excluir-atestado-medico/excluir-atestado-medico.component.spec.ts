import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcluirAtestadoMedicoComponent } from './excluir-atestado-medico.component';

describe('ExcluirAtestadoMedicoComponent', () => {
  let component: ExcluirAtestadoMedicoComponent;
  let fixture: ComponentFixture<ExcluirAtestadoMedicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExcluirAtestadoMedicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcluirAtestadoMedicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
