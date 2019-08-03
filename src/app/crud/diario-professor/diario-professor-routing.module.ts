import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImportarNotaBoletimComponent } from './importar-nota-boletim/importar-nota-boletim.component';
import { ListarDiarioProfessorComponent } from './listar-diario-professor/listar-diario-professor.component';
import { ArquivarDiarioProfessorComponent } from './arquivar-diario-professor/arquivar-diario-professor.component';
import { TransferirDiarioProfessorComponent } from './transferir-diario-professor/transferir-diario-professor.component';
import { InserirDiarioProfessorComponent } from './inserir-diario-professor/inserir-diario-professor.component';
import { GerenciarDiarioProfessorComponent } from './gerenciar-diario-professor/gerenciar-diario-professor.component';
import { AuthGuardService } from '../../guards/auth.guard.service';

const routes: Routes = [
  { path: "", component: GerenciarDiarioProfessorComponent, canActivate: [AuthGuardService] },
  { path: "inserir-diario-professor", component: InserirDiarioProfessorComponent, canActivate: [AuthGuardService] },
  { path: "transferir-diario-professor", component: TransferirDiarioProfessorComponent, canActivate: [AuthGuardService] },
  { path: "listar-diario-professor", component: ListarDiarioProfessorComponent, canActivate: [AuthGuardService] },
  { path: "arquivar-diario-professor", component: ArquivarDiarioProfessorComponent, canActivate: [AuthGuardService] },
  { path: "listar-diario-professor-disciplina-ano", component: ListarDiarioProfessorComponent, canActivate: [AuthGuardService] },
  { path: "importar-nota-boletim", component: ImportarNotaBoletimComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiarioProfessorRoutingModule { }
