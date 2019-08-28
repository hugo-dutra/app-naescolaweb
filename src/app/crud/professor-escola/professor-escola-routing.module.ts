import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../guards/auth.guard.service';
import { InserirProfessorEscolaComponent } from './inserir-professor-escola/inserir-professor-escola.component';

const routes: Routes = [
  { path: "", component: InserirProfessorEscolaComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfessorEscolaRoutingModule { }
