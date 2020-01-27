import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbCardModule } from '@nebular/theme';
import { TransferenciaRoutingModule } from './transferencia-routing.module';
import { GerenciarTransferenciaComponent } from './gerenciar-transferencia/gerenciar-transferencia.component';
import { TransferirTurmaComponent } from './transferir-turma/transferir-turma.component';
import { TransferirEscolaComponent } from './transferir-escola/transferir-escola.component';


@NgModule({
  declarations: [GerenciarTransferenciaComponent, TransferirTurmaComponent, TransferirEscolaComponent],
  imports: [
    CommonModule,
    TransferenciaRoutingModule,
    NbCardModule,
  ]
})
export class TransferenciaModule { }
