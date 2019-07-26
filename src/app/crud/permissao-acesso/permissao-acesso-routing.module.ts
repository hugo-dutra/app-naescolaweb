import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListarPermissaoAcessoComponent } from './listar-permissao-acesso/listar-permissao-acesso.component';
import { AuthGuardService } from '../../guards/auth.guard.service';

const routes: Routes = [
  { path: "", component: ListarPermissaoAcessoComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissaoAcessoRoutingModule { }
