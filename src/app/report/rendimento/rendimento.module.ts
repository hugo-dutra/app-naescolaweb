import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RendimentoRoutingModule } from './rendimento-routing.module';
import { AproveitamentoDisciplinaTurmaPeriodoComponent } from './aproveitamento-disciplina-turma-periodo/aproveitamento-disciplina-turma-periodo.component';
import { AproveitamentoProfessorDisciplinaPeriodoComponent } from './aproveitamento-professor-disciplina-periodo/aproveitamento-professor-disciplina-periodo.component';
import { RendimentoResumoPeriodoLetivoComponent } from './rendimento-resumo-periodo-letivo/rendimento-resumo-periodo-letivo.component';
import { GerenciarRelatorioRendimentoComponent } from './gerenciar-relatorio-rendimento/gerenciar-relatorio-rendimento.component';
import { NbCardModule } from '@nebular/theme';
import { ListarEstudanteDestaqueComponent } from './listar-estudante-destaque/listar-estudante-destaque.component';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [AproveitamentoDisciplinaTurmaPeriodoComponent, AproveitamentoProfessorDisciplinaPeriodoComponent, RendimentoResumoPeriodoLetivoComponent, GerenciarRelatorioRendimentoComponent, ListarEstudanteDestaqueComponent],
  imports: [
    CommonModule,
    NbCardModule,
    RendimentoRoutingModule,
    NgbPopoverModule,
  ]
})
export class RendimentoModule { }
