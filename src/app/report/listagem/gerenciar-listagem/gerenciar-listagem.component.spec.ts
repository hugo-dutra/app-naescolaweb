import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarListagemComponent } from './gerenciar-listagem.component';

describe('GerenciarListagemComponent', () => {
  let component: GerenciarListagemComponent;
  let fixture: ComponentFixture<GerenciarListagemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GerenciarListagemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GerenciarListagemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
