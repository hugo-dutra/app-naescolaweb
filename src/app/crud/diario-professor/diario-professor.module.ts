import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiarioProfessorRoutingModule } from './diario-professor-routing.module';
import { ArquivarDiarioProfessorComponent } from './arquivar-diario-professor/arquivar-diario-professor.component';
import { GerenciarDiarioProfessorComponent } from './gerenciar-diario-professor/gerenciar-diario-professor.component';
import { InserirDiarioProfessorComponent } from './inserir-diario-professor/inserir-diario-professor.component';
import { ListarDiarioProfessorComponent } from './listar-diario-professor/listar-diario-professor.component';
import { TransferirDiarioProfessorComponent } from './transferir-diario-professor/transferir-diario-professor.component';
import { ImportarNotaBoletimComponent } from './importar-nota-boletim/importar-nota-boletim.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ArquivarDiarioProfessorComponent,
    GerenciarDiarioProfessorComponent,
    InserirDiarioProfessorComponent,
    ListarDiarioProfessorComponent,
    TransferirDiarioProfessorComponent,
    ImportarNotaBoletimComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DiarioProfessorRoutingModule
  ]
})
export class DiarioProfessorModule { }
