import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoletimEstudanteRoutingModule } from './boletim-estudante-routing.module';
import { EnviarNotaBoletimComponent } from './enviar-nota-boletim/enviar-nota-boletim.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [EnviarNotaBoletimComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    BoletimEstudanteRoutingModule
  ]
})
export class BoletimEstudanteModule { }
