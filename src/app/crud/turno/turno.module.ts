import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TurnoRoutingModule } from './turno-routing.module';
import { AlterarTurnoComponent } from './alterar-turno/alterar-turno.component';
import { ExcluirTurnoComponent } from './excluir-turno/excluir-turno.component';
import { InserirTurnoComponent } from './inserir-turno/inserir-turno.component';
import { ListarTurnoComponent } from './listar-turno/listar-turno.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AlterarTurnoComponent,
    ExcluirTurnoComponent,
    InserirTurnoComponent,
    ListarTurnoComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    TurnoRoutingModule
  ]
})
export class TurnoModule { }
