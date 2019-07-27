import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EscolaRoutingModule } from './escola-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlterarEscolaComponent } from './alterar-escola/alterar-escola.component';
import { ExcluirEscolaComponent } from './excluir-escola/excluir-escola.component';
import { InserirEscolaComponent } from './inserir-escola/inserir-escola.component';
import { ListarEscolaComponent } from './listar-escola/listar-escola.component';

@NgModule({
  declarations: [AlterarEscolaComponent, ExcluirEscolaComponent, InserirEscolaComponent, ListarEscolaComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    EscolaRoutingModule
  ]
})
export class EscolaModule { }
