import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../guards/auth.guard.service';
import { ListarPerfilComponent } from './listar-perfil/listar-perfil.component';
import { AlterarPerfilComponent } from './alterar-perfil/alterar-perfil.component';
import { ExcluirPerfilComponent } from './excluir-perfil/excluir-perfil.component';
import { InserirPerfilComponent } from './inserir-perfil/inserir-perfil.component';

const routes: Routes = [
  { path: "", component: ListarPerfilComponent, canActivate: [AuthGuardService] },
  { path: "alterar-perfil", component: AlterarPerfilComponent, data: { objeto: "objeto" }, canActivate: [AuthGuardService] },
  { path: "excluir-perfil", component: ExcluirPerfilComponent, data: { objeto: "objeto" }, canActivate: [AuthGuardService] },
  { path: "inserir-perfil", component: InserirPerfilComponent, canActivate: [AuthGuardService] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerfilRoutingModule { }
