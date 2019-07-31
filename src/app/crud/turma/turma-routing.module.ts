import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListarTurmaComponent } from './listar-turma/listar-turma.component';
import { InserirTurmaComponent } from './inserir-turma/inserir-turma.component';
import { ExcluirTurmaComponent } from './excluir-turma/excluir-turma.component';
import { AlterarTurmaComponent } from './alterar-turma/alterar-turma.component';
import { ListarEstudantesTurmaComponent } from './listar-estudantes-turma/listar-estudantes-turma.component';
import { AuthGuardService } from '../../guards/auth.guard.service';

const routes: Routes = [
  { path: "", component: ListarTurmaComponent, data: { objeto: "objeto" }, canActivate: [AuthGuardService] },
  { path: "inserir-turma", component: InserirTurmaComponent, canActivate: [AuthGuardService] },
  { path: "excluir-turma", component: ExcluirTurmaComponent, data: { objeto: "objeto" }, canActivate: [AuthGuardService] },
  { path: "alterar-turma", component: AlterarTurmaComponent, data: { objeto: "objeto" }, canActivate: [AuthGuardService] },
  { path: "listar-estudantes-turma-id", component: ListarEstudantesTurmaComponent, data: { objeto: "objeto" }, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TurmaRoutingModule { }
