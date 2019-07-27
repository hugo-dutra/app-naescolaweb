import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InserirUsuarioEscolaComponent } from './inserir-usuario-escola/inserir-usuario-escola.component';
import { AuthGuardService } from '../../guards/auth.guard.service';

const routes: Routes = [
  { path: "", component: InserirUsuarioEscolaComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioEscolaRoutingModule { }
