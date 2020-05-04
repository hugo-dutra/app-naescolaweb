import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InserirEntradaPosteriorComponent } from './inserir-entrada-posterior.component';

describe('InserirEntradaPosteriorComponent', () => {
  let component: InserirEntradaPosteriorComponent;
  let fixture: ComponentFixture<InserirEntradaPosteriorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InserirEntradaPosteriorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InserirEntradaPosteriorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
