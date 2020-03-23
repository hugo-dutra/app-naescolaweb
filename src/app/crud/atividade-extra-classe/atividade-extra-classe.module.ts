import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AtividadeExtraClasseRoutingModule } from './atividade-extra-classe-routing.module';
import { GerenciarAtividadeComponent } from './gerenciar-atividade/gerenciar-atividade.component';
import { ListarAtividadeComponent } from './listar-atividade/listar-atividade.component';
import { InserirAtividadeComponent } from './inserir-atividade/inserir-atividade.component';
import { AtividadeExtraClasseComponent } from './atividade-extra-classe/atividade-extra-classe.component';

@NgModule({
  declarations: [GerenciarAtividadeComponent, ListarAtividadeComponent, InserirAtividadeComponent, AtividadeExtraClasseComponent],
  imports: [
    CommonModule,
    AtividadeExtraClasseRoutingModule
  ]
})
export class AtividadeExtraClasseModule { }
