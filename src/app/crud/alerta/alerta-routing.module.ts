import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GerenciarAlertaComponent } from './gerenciar-alerta/gerenciar-alerta.component';
import { ListarAlertaComponent } from './listar-alerta/listar-alerta.component';
import { AtribuirAlertaUsuarioComponent } from './atribuir-alerta-usuario/atribuir-alerta-usuario.component';
import { InserirAlertaComponent } from './inserir-alerta/inserir-alerta.component';
import { ExcluirAlertaComponent } from './excluir-alerta/excluir-alerta.component';
import { AlterarAlertaComponent } from './alterar-alerta/alterar-alerta.component';
import { ReceberAlertaOcorrenciaComponent } from './receber-alerta-ocorrencia/receber-alerta-ocorrencia.component';
import { AuthGuardService } from '../../guards/auth.guard.service';

const routes: Routes = [
  { path: "", component: GerenciarAlertaComponent, canActivate: [AuthGuardService] },
  { path: "listar-alerta", component: ListarAlertaComponent, canActivate: [AuthGuardService] },
  { path: "atribuir-alerta-usuario", component: AtribuirAlertaUsuarioComponent, canActivate: [AuthGuardService] },
  { path: "inserir-alerta", component: InserirAlertaComponent, canActivate: [AuthGuardService] },
  { path: "excluir-alerta", component: ExcluirAlertaComponent, canActivate: [AuthGuardService] },
  { path: "alterar-alerta", component: AlterarAlertaComponent, canActivate: [AuthGuardService] },
  { path: "receber-alerta-ocorrencia", component: ReceberAlertaOcorrenciaComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlertaRoutingModule { }
