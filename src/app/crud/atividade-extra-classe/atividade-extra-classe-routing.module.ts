import { ListarAtividadeComponent } from './listar-atividade/listar-atividade.component';
import { InserirAtividadeComponent } from './inserir-atividade/inserir-atividade.component';
import { GerenciarAtividadeComponent } from './gerenciar-atividade/gerenciar-atividade.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../guards/auth.guard.service';

const routes: Routes = [
  { path: '', component: GerenciarAtividadeComponent, canActivate: [AuthGuardService] },
  { path: 'inserir-atividade-extra-classe', component: InserirAtividadeComponent, canActivate: [AuthGuardService] },
  { path: 'listar-atividade-extra-classe', component: ListarAtividadeComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AtividadeExtraClasseRoutingModule { }
