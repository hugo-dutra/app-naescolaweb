import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiretorRoutingModule } from './diretor-routing.module';
import { AlterarDiretorComponent } from './alterar-diretor/alterar-diretor.component';
import { ExcluirDiretorComponent } from './excluir-diretor/excluir-diretor.component';
import { InserirDiretorComponent } from './inserir-diretor/inserir-diretor.component';
import { ListarDiretorComponent } from './listar-diretor/listar-diretor.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AlterarDiretorComponent, ExcluirDiretorComponent, InserirDiretorComponent, ListarDiretorComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    DiretorRoutingModule
  ]
})
export class DiretorModule { }
