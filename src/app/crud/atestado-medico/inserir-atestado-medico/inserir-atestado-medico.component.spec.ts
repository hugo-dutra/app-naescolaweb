import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InserirAtestadoMedicoComponent } from './inserir-atestado-medico.component';

describe('InserirAtestadoMedicoComponent', () => {
  let component: InserirAtestadoMedicoComponent;
  let fixture: ComponentFixture<InserirAtestadoMedicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InserirAtestadoMedicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InserirAtestadoMedicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
