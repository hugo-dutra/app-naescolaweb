import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InserirAtividadeComponent } from './inserir-atividade.component';

describe('InserirAtividadeComponent', () => {
  let component: InserirAtividadeComponent;
  let fixture: ComponentFixture<InserirAtividadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InserirAtividadeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InserirAtividadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
