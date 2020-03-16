import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InserirProfessorTurmaComponent } from './inserir-professor-turma/inserir-professor-turma.component';
import { AuthGuardService } from '../../guards/auth.guard.service';

const routes: Routes = [
  { path: '', component: InserirProfessorTurmaComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfessorTurmaRoutingModule { }
