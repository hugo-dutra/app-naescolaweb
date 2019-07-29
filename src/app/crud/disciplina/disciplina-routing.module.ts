import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListarDisciplinaComponent } from './listar-disciplina/listar-disciplina.component';
import { AlterarDisciplinaComponent } from './alterar-disciplina/alterar-disciplina.component';
import { ExcluirDisciplinaComponent } from './excluir-disciplina/excluir-disciplina.component';
import { InserirDisciplinaComponent } from './inserir-disciplina/inserir-disciplina.component';
import { AuthGuardService } from '../../guards/auth.guard.service';

const routes: Routes = [
  { path: "", component: ListarDisciplinaComponent, canActivate: [AuthGuardService] },
  { path: "alterar-disciplina", component: AlterarDisciplinaComponent, data: { objeto: "objeto" }, canActivate: [AuthGuardService] },
  { path: "excluir-disciplina", component: ExcluirDisciplinaComponent, data: { objeto: "objeto" }, canActivate: [AuthGuardService] },
  { path: "inserir-disciplina", component: InserirDisciplinaComponent, canActivate: [AuthGuardService] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DisciplinaRoutingModule { }
