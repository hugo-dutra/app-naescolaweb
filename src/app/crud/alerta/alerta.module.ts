import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertaRoutingModule } from './alerta-routing.module';
import { AlterarAlertaComponent } from './alterar-alerta/alterar-alerta.component';
import { AtribuirAlertaUsuarioComponent } from './atribuir-alerta-usuario/atribuir-alerta-usuario.component';
import { ExcluirAlertaComponent } from './excluir-alerta/excluir-alerta.component';
import { GerenciarAlertaComponent } from './gerenciar-alerta/gerenciar-alerta.component';
import { InserirAlertaComponent } from './inserir-alerta/inserir-alerta.component';
import { ListarAlertaComponent } from './listar-alerta/listar-alerta.component';
import { ReceberAlertaOcorrenciaComponent } from './receber-alerta-ocorrencia/receber-alerta-ocorrencia.component';
import { NbCardModule } from '@nebular/theme';

@NgModule({
  declarations: [
    AlterarAlertaComponent,
    AtribuirAlertaUsuarioComponent,
    ExcluirAlertaComponent,
    GerenciarAlertaComponent,
    InserirAlertaComponent,
    ListarAlertaComponent,
    ReceberAlertaOcorrenciaComponent
  ],
  imports: [
    CommonModule,
    AlertaRoutingModule,
    NbCardModule,
  ],
})
export class AlertaModule { }
