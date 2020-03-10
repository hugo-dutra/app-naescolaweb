import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarAplicativoEstudanteSemFotoComponent } from './listar-aplicativo-estudante-sem-foto.component';

describe('ListarAplicativoEstudanteSemFotoComponent', () => {
  let component: ListarAplicativoEstudanteSemFotoComponent;
  let fixture: ComponentFixture<ListarAplicativoEstudanteSemFotoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarAplicativoEstudanteSemFotoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarAplicativoEstudanteSemFotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
