import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TipoOcorrenciaDisciplinarRoutingModule } from './tipo-ocorrencia-disciplinar-routing.module';
import { AlterarTipoOcorrenciaDisciplinarComponent } from './alterar-tipo-ocorrencia-disciplinar/alterar-tipo-ocorrencia-disciplinar.component';
import { ExcluirTipoOcorrenciaDisciplinarComponent } from './excluir-tipo-ocorrencia-disciplinar/excluir-tipo-ocorrencia-disciplinar.component';
import { InserirTipoOcorrenciaDisciplinarComponent } from './inserir-tipo-ocorrencia-disciplinar/inserir-tipo-ocorrencia-disciplinar.component';
import { ListarTipoOcorrenciaDisciplinarComponent } from './listar-tipo-ocorrencia-disciplinar/listar-tipo-ocorrencia-disciplinar.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AlterarTipoOcorrenciaDisciplinarComponent, ExcluirTipoOcorrenciaDisciplinarComponent, InserirTipoOcorrenciaDisciplinarComponent, ListarTipoOcorrenciaDisciplinarComponent],
  imports: [
    CommonModule,
    TipoOcorrenciaDisciplinarRoutingModule,
    CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule
  ]
})
export class TipoOcorrenciaDisciplinarModule { }
