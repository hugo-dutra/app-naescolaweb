import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtribuirAlertaUsuarioComponent } from './atribuir-alerta-usuario.component';

describe('AtribuirAlertaUsuarioComponent', () => {
  let component: AtribuirAlertaUsuarioComponent;
  let fixture: ComponentFixture<AtribuirAlertaUsuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtribuirAlertaUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtribuirAlertaUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
