import { SugestaoUsuarioComponent } from './sugestao-usuario/sugestao-usuario.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListarUsuarioComponent } from './listar-usuario/listar-usuario.component';
import { AuthGuardService } from '../../guards/auth.guard.service';
import { InserirUsuarioComponent } from './inserir-usuario/inserir-usuario.component';
import { ExcluirUsuarioComponent } from './excluir-usuario/excluir-usuario.component';
import { AlterarUsuarioComponent } from './alterar-usuario/alterar-usuario.component';
import { GerenciarUsuarioComponent } from './gerenciar-usuario/gerenciar-usuario.component';
import { AlterarSenhaUsuarioComponent } from './alterar-senha-usuario/alterar-senha-usuario.component';

const routes: Routes = [
  {
    path: '', component: ListarUsuarioComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'inserir-usuario', component: InserirUsuarioComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'excluir-usuario', component: ExcluirUsuarioComponent, data: { objeto: 'objeto' },
    canActivate: [AuthGuardService],
  },
  {
    path: 'alterar-usuario', component: AlterarUsuarioComponent, data: { objeto: 'objeto' },
    canActivate: [AuthGuardService],
  },
  {
    path: 'gerenciar-usuario', component: GerenciarUsuarioComponent, data: { objeto: 'objeto' },
    canActivate: [AuthGuardService],
  },
  {
    path: 'alterar-senha-usuario', component: AlterarSenhaUsuarioComponent, data: { objeto: 'objeto' },
    canActivate: [AuthGuardService],
  },
  { path: 'enviar-sugestao-usuario', component: SugestaoUsuarioComponent, data: { objeto: 'objeto' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuarioRoutingModule { }
