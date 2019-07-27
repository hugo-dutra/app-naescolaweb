import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListarProfessorComponent } from './listar-professor/listar-professor.component';
import { AlterarProfessorComponent } from './alterar-professor/alterar-professor.component';
import { ExcluirProfessorComponent } from './excluir-professor/excluir-professor.component';
import { InserirProfessorComponent } from './inserir-professor/inserir-professor.component';
import { AuthGuardService } from '../../guards/auth.guard.service';

const routes: Routes = [
  { path: "", component: ListarProfessorComponent, canActivate: [AuthGuardService] },
  { path: "alterar-professor", component: AlterarProfessorComponent, data: { objeto: "objeto" }, canActivate: [AuthGuardService] },
  { path: "excluir-professor", component: ExcluirProfessorComponent, data: { objeto: "objeto" }, canActivate: [AuthGuardService] },
  { path: "inserir-professor", component: InserirProfessorComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfessorRoutingModule { }
