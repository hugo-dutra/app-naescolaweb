import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarEntradaPosteriorComponent } from './listar-entrada-posterior.component';

describe('ListarEntradaPosteriorComponent', () => {
  let component: ListarEntradaPosteriorComponent;
  let fixture: ComponentFixture<ListarEntradaPosteriorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarEntradaPosteriorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarEntradaPosteriorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
