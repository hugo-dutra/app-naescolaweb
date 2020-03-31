import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarSugestaoUsuarioComponent } from './listar-sugestao-usuario.component';

describe('ListarSugestaoUsuarioComponent', () => {
  let component: ListarSugestaoUsuarioComponent;
  let fixture: ComponentFixture<ListarSugestaoUsuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarSugestaoUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarSugestaoUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
