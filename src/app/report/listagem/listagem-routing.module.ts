import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GerenciarListagemComponent } from './gerenciar-listagem/gerenciar-listagem.component';
import { AuthGuardService } from '../../guards/auth.guard.service';
import { GeradorListagemComponent } from './gerador-listagem/gerador-listagem.component';

const routes: Routes = [
  { path: "", component: GerenciarListagemComponent, canActivate: [AuthGuardService] },
  { path: "listar-gerador-listagem", component: GeradorListagemComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListagemRoutingModule { }
