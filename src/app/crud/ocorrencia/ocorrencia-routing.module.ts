import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InserirOcorrenciaComponent } from './inserir-ocorrencia/inserir-ocorrencia.component';
import { AuthGuardService } from '../../guards/auth.guard.service';

const routes: Routes = [
  { path: "", component: InserirOcorrenciaComponent, canActivate: [AuthGuardService] },
  /* { path: "listar-quantidade-tipo-ocorrencia", component: ListarQuantidadeTipoOcorrenciaComponent, canActivate: [AuthGuardService] },
  { path: "calcular-avaliacao-social", component: CalcularAvaliacaoSocialComponent, canActivate: [AuthGuardService] }, */
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OcorrenciaRoutingModule { }
