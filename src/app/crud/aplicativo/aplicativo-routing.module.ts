import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GerenciarAplicativoComponent } from './gerenciar-aplicativo/gerenciar-aplicativo.component';
import { AuthGuardService } from '../../guards/auth.guard.service';
import { SincronizarEstudanteAplicativoComponent } from './sincronizar-estudante-aplicativo/sincronizar-estudante-aplicativo.component';
import { GerarQrcodeAplicativoEstudanteComponent } from './gerar-qrcode-aplicativo-estudante/gerar-qrcode-aplicativo-estudante.component';
import { GerarQrcodeAplicativoAdministrativoComponent } from './gerar-qrcode-aplicativo-administrativo/gerar-qrcode-aplicativo-administrativo.component';
import { BaixarFotoEstudanteAplicativoComponent } from './baixar-foto-estudante-aplicativo/baixar-foto-estudante-aplicativo.component';
import { GravarTipoOcorrenciaAplicativoAdministrativoComponent } from './gravar-tipo-ocorrencia-aplicativo-administrativo/gravar-tipo-ocorrencia-aplicativo-administrativo.component';

const routes: Routes = [
  { path: "", component: GerenciarAplicativoComponent, canActivate: [AuthGuardService] },
  { path: "sincronizar-estudante-aplicativo", component: SincronizarEstudanteAplicativoComponent, canActivate: [AuthGuardService] },
  { path: "gerar-qrcode-aplicativo-estudante", component: GerarQrcodeAplicativoEstudanteComponent, canActivate: [AuthGuardService] },
  { path: "gerar-qrcode-aplicativo-administrativo", component: GerarQrcodeAplicativoAdministrativoComponent, canActivate: [AuthGuardService] },
  { path: "baixar-foto-estudante-aplicativo", component: BaixarFotoEstudanteAplicativoComponent, canActivate: [AuthGuardService] },
  { path: "gravar-tipo-ocorrencia-aplicativo-administrativo", component: GravarTipoOcorrenciaAplicativoAdministrativoComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AplicativoRoutingModule { }
