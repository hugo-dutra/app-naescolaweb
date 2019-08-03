import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GerenciarDiarioRegistroComponent } from './gerenciar-diario-registro/gerenciar-diario-registro.component';
import { InserirDiarioAvaliacaoComponent } from './inserir-diario-avaliacao/inserir-diario-avaliacao.component';
import { AlterarDiarioAvaliacaoComponent } from './alterar-diario-avaliacao/alterar-diario-avaliacao.component';
import { InserirDiarioObservacaoEstudanteComponent } from './inserir-diario-observacao-estudante/inserir-diario-observacao-estudante.component';
import { InserirDiarioObservacaoGeralComponent } from './inserir-diario-observacao-geral/inserir-diario-observacao-geral.component';
import { InserirRegistroDiarioComponent } from './inserir-registro-diario/inserir-registro-diario.component';
import { AlterarRegistroDiarioComponent } from './alterar-registro-diario/alterar-registro-diario.component';
import { ListarDiarioAvaliacaoEstudanteComponent } from './listar-diario-avaliacao-estudante/listar-diario-avaliacao-estudante.component';
import { ListarTurmaDisciplinaProfessorComponent } from './listar-turma-disciplina-professor/listar-turma-disciplina-professor.component';
import { LancarManualNotaBimestralConselhoProfessorDiscipliaComponent } from './lancar-manual-nota-bimestral-conselho-professor-disciplia/lancar-manual-nota-bimestral-conselho-professor-disciplia.component';
import { AuthGuardService } from '../../guards/auth.guard.service';

const routes: Routes = [
  { path: "", component: GerenciarDiarioRegistroComponent, canActivate: [AuthGuardService] },
  { path: "inserir-diario-avaliacao", component: InserirDiarioAvaliacaoComponent, canActivate: [AuthGuardService] },
  { path: "alterar-diario-avaliacao", component: AlterarDiarioAvaliacaoComponent, canActivate: [AuthGuardService] },
  { path: "inserir-diario-observacao-estudante", component: InserirDiarioObservacaoEstudanteComponent, canActivate: [AuthGuardService] },
  { path: "inserir-diario-observacao-geral", component: InserirDiarioObservacaoGeralComponent, canActivate: [AuthGuardService] },
  { path: "inserir-registro-diario", component: InserirRegistroDiarioComponent, canActivate: [AuthGuardService] },
  { path: "alterar-registro-diario", component: AlterarRegistroDiarioComponent, canActivate: [AuthGuardService] },
  { path: "listar-diario-avaliacao-estudante", component: ListarDiarioAvaliacaoEstudanteComponent, canActivate: [AuthGuardService] },
  { path: "listar-diario-usuario-escola", component: ListarDiarioAvaliacaoEstudanteComponent, canActivate: [AuthGuardService] },
  { path: "listar-turma-disciplina-professor", component: ListarTurmaDisciplinaProfessorComponent, canActivate: [AuthGuardService] },
  { path: "lancar-manual-nota-bimestral-conselho", component: LancarManualNotaBimestralConselhoProfessorDiscipliaComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiarioRegistroRoutingModule { }
