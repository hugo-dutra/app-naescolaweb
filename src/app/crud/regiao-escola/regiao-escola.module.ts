import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegiaoEscolaRoutingModule } from './regiao-escola-routing.module';
import { AlterarRegiaoEscolaComponent } from './alterar-regiao-escola/alterar-regiao-escola.component';
import { ExcluirRegiaoEscolaComponent } from './excluir-regiao-escola/excluir-regiao-escola.component';
import { InserirRegiaoEscolaComponent } from './inserir-regiao-escola/inserir-regiao-escola.component';
import { ListarRegiaoEscolaComponent } from './listar-regiao-escola/listar-regiao-escola.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


@NgModule({
  declarations: [AlterarRegiaoEscolaComponent, ExcluirRegiaoEscolaComponent, InserirRegiaoEscolaComponent, ListarRegiaoEscolaComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RegiaoEscolaRoutingModule
  ]
})
export class RegiaoEscolaModule { }
