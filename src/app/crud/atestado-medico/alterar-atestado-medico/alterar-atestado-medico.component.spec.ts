import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlterarAtestadoMedicoComponent } from './alterar-atestado-medico.component';

describe('AlterarAtestadoMedicoComponent', () => {
  let component: AlterarAtestadoMedicoComponent;
  let fixture: ComponentFixture<AlterarAtestadoMedicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlterarAtestadoMedicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlterarAtestadoMedicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
