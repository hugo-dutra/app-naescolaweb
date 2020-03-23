import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AtividadeExtraClasseRoutingModule } from './atividade-extra-classe-routing.module';
import { GerenciarAtividadeComponent } from './gerenciar-atividade/gerenciar-atividade.component';
import { ListarAtividadeComponent } from './listar-atividade/listar-atividade.component';
import { InserirAtividadeComponent } from './inserir-atividade/inserir-atividade.component';
import { NbCardModule } from '@nebular/theme';


@NgModule({
  declarations: [GerenciarAtividadeComponent, ListarAtividadeComponent, InserirAtividadeComponent],
  imports: [
    CommonModule,
    AtividadeExtraClasseRoutingModule,
    NbCardModule,
  ],
})
export class AtividadeExtraClasseModule { }
