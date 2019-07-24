import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from "@angular/router";

import { AreaConhecimentoRoutingModule } from './area-conhecimento-routing.module';
import { AlterarAreaConhecimentoComponent } from './alterar-area-conhecimento/alterar-area-conhecimento.component';
import { ExcluirAreaConhecimentoComponent } from './excluir-area-conhecimento/excluir-area-conhecimento.component';
import { InserirAreaConhecimentoComponent } from './inserir-area-conhecimento/inserir-area-conhecimento.component';
import { ListarAreaConhecimentoComponent } from './listar-area-conhecimento/listar-area-conhecimento.component';

@NgModule({
  declarations: [
    AlterarAreaConhecimentoComponent,
    ExcluirAreaConhecimentoComponent,
    InserirAreaConhecimentoComponent,
    ListarAreaConhecimentoComponent],
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    CommonModule,
    AreaConhecimentoRoutingModule
  ],
})
export class AreaConhecimentoModule { }
