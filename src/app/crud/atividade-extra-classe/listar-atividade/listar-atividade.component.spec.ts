import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarAtividadeComponent } from './listar-atividade.component';

describe('ListarAtividadeComponent', () => {
  let component: ListarAtividadeComponent;
  let fixture: ComponentFixture<ListarAtividadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarAtividadeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarAtividadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
