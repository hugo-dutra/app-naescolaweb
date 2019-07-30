import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EtapaEnsinoRoutingModule } from './etapa-ensino-routing.module';
import { AlterarEtapaEnsinoComponent } from './alterar-etapa-ensino/alterar-etapa-ensino.component';
import { ExcluirEtapaEnsinoComponent } from './excluir-etapa-ensino/excluir-etapa-ensino.component';
import { InserirEtapaEnsinoComponent } from './inserir-etapa-ensino/inserir-etapa-ensino.component';
import { ListarEtapaEnsinoComponent } from './listar-etapa-ensino/listar-etapa-ensino.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AlterarEtapaEnsinoComponent, ExcluirEtapaEnsinoComponent, InserirEtapaEnsinoComponent, ListarEtapaEnsinoComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    EtapaEnsinoRoutingModule
  ]
})
export class EtapaEnsinoModule { }
