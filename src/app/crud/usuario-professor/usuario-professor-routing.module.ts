import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InserirUsuarioProfessorComponent } from './inserir-usuario-professor/inserir-usuario-professor.component';
import { AuthGuardService } from '../../guards/auth.guard.service';

const routes: Routes = [
  { path: "", component: InserirUsuarioProfessorComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioProfessorRoutingModule { }
