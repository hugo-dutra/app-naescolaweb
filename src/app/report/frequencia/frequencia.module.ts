import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrequenciaRoutingModule } from './frequencia-routing.module';
import { FrequenciaPortariaPeriodoComponent } from './frequencia-portaria-periodo/frequencia-portaria-periodo.component';
import { FrequenciaBoletimTurmaGeralComponent } from './frequencia-boletim-turma-geral/frequencia-boletim-turma-geral.component';
import { GerenciarRelatorioFrequenciaGeralComponent } from './gerenciar-relatorio-frequencia-geral/gerenciar-relatorio-frequencia-geral.component';
import { NbCardModule } from '@nebular/theme';

@NgModule({
  declarations: [FrequenciaPortariaPeriodoComponent, FrequenciaBoletimTurmaGeralComponent, GerenciarRelatorioFrequenciaGeralComponent],
  imports: [
    CommonModule,
    FrequenciaRoutingModule,
    NbCardModule,
  ]
})
export class FrequenciaModule { }
