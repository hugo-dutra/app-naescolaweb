import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SerieRoutingModule } from './serie-routing.module';
import { AlterarSerieComponent } from './alterar-serie/alterar-serie.component';
import { ExcluirSerieComponent } from './excluir-serie/excluir-serie.component';
import { InserirSerieComponent } from './inserir-serie/inserir-serie.component';
import { ListarSerieComponent } from './listar-serie/listar-serie.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AlterarSerieComponent,
    ExcluirSerieComponent,
    InserirSerieComponent,
    ListarSerieComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    SerieRoutingModule
  ]
})
export class SerieModule { }
