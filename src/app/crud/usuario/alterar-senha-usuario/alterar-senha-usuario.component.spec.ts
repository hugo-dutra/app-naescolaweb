import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlterarSenhaUsuarioComponent } from './alterar-senha-usuario.component';

describe('AlterarSenhaUsuarioComponent', () => {
  let component: AlterarSenhaUsuarioComponent;
  let fixture: ComponentFixture<AlterarSenhaUsuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlterarSenhaUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlterarSenhaUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
