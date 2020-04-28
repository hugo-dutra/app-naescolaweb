import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeradorListagemComponent } from './gerador-listagem.component';

describe('GeradorListagemComponent', () => {
  let component: GeradorListagemComponent;
  let fixture: ComponentFixture<GeradorListagemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeradorListagemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeradorListagemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
