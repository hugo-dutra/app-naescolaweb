import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListarAreaConhecimentoComponent } from './listar-area-conhecimento/listar-area-conhecimento.component';
import { AuthGuardService } from '../../guards/auth.guard.service';
import { InserirAreaConhecimentoComponent } from './inserir-area-conhecimento/inserir-area-conhecimento.component';
import { ExcluirAreaConhecimentoComponent } from './excluir-area-conhecimento/excluir-area-conhecimento.component';
import { AlterarAreaConhecimentoComponent } from './alterar-area-conhecimento/alterar-area-conhecimento.component';

const routes: Routes = [
  { path: '', component: ListarAreaConhecimentoComponent, canActivate: [AuthGuardService] },
  { path: 'inserir-area-conhecimento', component: InserirAreaConhecimentoComponent, canActivate: [AuthGuardService] },
  { path: 'excluir-area-conhecimento', component: ExcluirAreaConhecimentoComponent, canActivate: [AuthGuardService] },
  { path: 'alterar-area-conhecimento', component: AlterarAreaConhecimentoComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AreaConhecimentoRoutingModule { }
