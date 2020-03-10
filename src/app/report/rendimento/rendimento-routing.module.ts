import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  RendimentoResumoPeriodoLetivoComponent,
} from './rendimento-resumo-periodo-letivo/rendimento-resumo-periodo-letivo.component';
import {
  AproveitamentoDisciplinaTurmaPeriodoComponent,
} from './aproveitamento-disciplina-turma-periodo/aproveitamento-disciplina-turma-periodo.component';
import {
  AproveitamentoProfessorDisciplinaPeriodoComponent,
} from './aproveitamento-professor-disciplina-periodo/aproveitamento-professor-disciplina-periodo.component';
import { AuthGuardService } from '../../guards/auth.guard.service';
import {
  GerenciarRelatorioRendimentoComponent,
} from './gerenciar-relatorio-rendimento/gerenciar-relatorio-rendimento.component';
import { ListarEstudanteDestaqueComponent } from './listar-estudante-destaque/listar-estudante-destaque.component';

const routes: Routes = [
  { path: '', component: GerenciarRelatorioRendimentoComponent },
  {
    path: 'grafico-resumo-periodo-letivo',
    component: RendimentoResumoPeriodoLetivoComponent, canActivate: [AuthGuardService],
  },
  {
    path: 'grafico-aproveitamento-disciplina-turma-periodo-letivo',
    component: AproveitamentoDisciplinaTurmaPeriodoComponent, canActivate: [AuthGuardService],
  },
  {
    path: 'grafico-aproveitamento-professor-disciplina-periodo-letivo',
    component: AproveitamentoProfessorDisciplinaPeriodoComponent, canActivate: [AuthGuardService],
  },
  {
    path: 'listar-estudante-destaque',
    component: ListarEstudanteDestaqueComponent, canActivate: [AuthGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RendimentoRoutingModule { }
