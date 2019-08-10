import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListarGraficoOcorrenciaComponent } from './listar-grafico-ocorrencia/listar-grafico-ocorrencia.component';
import { AuthGuardService } from '../../guards/auth.guard.service';
import { GerenciarRelatorioDisciplinarComponent } from './gerenciar-relatorio-disciplinar/gerenciar-relatorio-disciplinar.component';
import { CalcularAvaliacaoSocialComponent } from './calcular-avaliacao-social/calcular-avaliacao-social.component';
import { ListarQuantidadeTipoOcorrenciaComponent } from './listar-quantidade-tipo-ocorrencia/listar-quantidade-tipo-ocorrencia.component';

const routes: Routes = [
  { path: "", component: GerenciarRelatorioDisciplinarComponent, canActivate: [AuthGuardService] },
  { path: "listar-grafico-ocorrencia", component: ListarGraficoOcorrenciaComponent, canActivate: [AuthGuardService] },
  { path: "calcular-avaliacao-social", component: CalcularAvaliacaoSocialComponent, canActivate: [AuthGuardService] },
  { path: "listar-quantidade-tipo-ocorrencia", component: ListarQuantidadeTipoOcorrenciaComponent, canActivate: [AuthGuardService] },
];




@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DisciplinarRoutingModule { }
