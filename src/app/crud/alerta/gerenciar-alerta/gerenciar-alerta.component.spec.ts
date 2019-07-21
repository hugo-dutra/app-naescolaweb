import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarAlertaComponent } from './gerenciar-alerta.component';

describe('GerenciarAlertaComponent', () => {
  let component: GerenciarAlertaComponent;
  let fixture: ComponentFixture<GerenciarAlertaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GerenciarAlertaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GerenciarAlertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
