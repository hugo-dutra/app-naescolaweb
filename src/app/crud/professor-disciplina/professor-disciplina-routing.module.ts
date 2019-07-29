import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InserirProfessorDisciplinaComponent } from './inserir-professor-disciplina/inserir-professor-disciplina.component';
import { ListarProfessorDisciplinaComponent } from './listar-professor-disciplina/listar-professor-disciplina.component';
import { AuthGuardService } from '../../guards/auth.guard.service';

const routes: Routes = [
  { path: "", component: InserirProfessorDisciplinaComponent, data: { objeto: "objeto" }, canActivate: [AuthGuardService] },
  { path: "listar-professor-disciplina", component: ListarProfessorDisciplinaComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfessorDisciplinaRoutingModule { }
