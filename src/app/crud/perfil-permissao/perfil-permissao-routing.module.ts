import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InserirPerfilPermissaoComponent } from './inserir-perfil-permissao/inserir-perfil-permissao.component';
import { AuthGuardService } from '../../guards/auth.guard.service';

const routes: Routes = [
  { path: "", component: InserirPerfilPermissaoComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerfilPermissaoRoutingModule { }
