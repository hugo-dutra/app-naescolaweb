import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OcorrenciaRoutingModule } from './ocorrencia-routing.module';
import { InserirOcorrenciaComponent } from './inserir-ocorrencia/inserir-ocorrencia.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '../forms/forms.module';

@NgModule({
  declarations: [InserirOcorrenciaComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    NgbModule,
    OcorrenciaRoutingModule
  ]
})
export class OcorrenciaModule { }
