import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OcorrenciaRoutingModule } from './ocorrencia-routing.module';
import { InserirOcorrenciaComponent } from './inserir-ocorrencia/inserir-ocorrencia.component';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModuleModule } from '../../shared-module/shared-module.module';
import { FormsModule } from '@angular/forms';
import { HintModule } from 'angular-custom-tour';

@NgModule({
  declarations: [InserirOcorrenciaComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    HintModule,
    NgbModule,
    OcorrenciaRoutingModule,
    SharedModuleModule,
  ]
})
export class OcorrenciaModule { }
