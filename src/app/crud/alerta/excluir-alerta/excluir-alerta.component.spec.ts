import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcluirAlertaComponent } from './excluir-alerta.component';

describe('ExcluirAlertaComponent', () => {
  let component: ExcluirAlertaComponent;
  let fixture: ComponentFixture<ExcluirAlertaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExcluirAlertaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcluirAlertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
