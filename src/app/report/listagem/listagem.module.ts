import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListagemRoutingModule } from './listagem-routing.module';
import { GeradorListagemComponent } from './gerador-listagem/gerador-listagem.component';
import { GerenciarListagemComponent } from './gerenciar-listagem/gerenciar-listagem.component';
import { NbCardModule } from '@nebular/theme';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [GeradorListagemComponent, GerenciarListagemComponent],
  imports: [
    CommonModule,
    ListagemRoutingModule,
    NbCardModule,
    FormsModule,
  ]
})
export class ListagemModule { }
