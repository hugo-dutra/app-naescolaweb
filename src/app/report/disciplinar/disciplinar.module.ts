import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DisciplinarRoutingModule } from './disciplinar-routing.module';
import { CalcularAvaliacaoSocialComponent } from './calcular-avaliacao-social/calcular-avaliacao-social.component';
import { ListarGraficoOcorrenciaComponent } from './listar-grafico-ocorrencia/listar-grafico-ocorrencia.component';
import { ListarQuantidadeTipoOcorrenciaComponent } from './listar-quantidade-tipo-ocorrencia/listar-quantidade-tipo-ocorrencia.component';
import { GerenciarRelatorioDisciplinarComponent } from './gerenciar-relatorio-disciplinar/gerenciar-relatorio-disciplinar.component';

@NgModule({
  declarations: [CalcularAvaliacaoSocialComponent, ListarGraficoOcorrenciaComponent, ListarQuantidadeTipoOcorrenciaComponent, GerenciarRelatorioDisciplinarComponent],
  imports: [
    CommonModule,
    DisciplinarRoutingModule
  ]
})
export class DisciplinarModule { }
