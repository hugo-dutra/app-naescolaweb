import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfessorRoutingModule } from './professor-routing.module';
import { AlterarProfessorComponent } from './alterar-professor/alterar-professor.component';
import { ExcluirProfessorComponent } from './excluir-professor/excluir-professor.component';
import { InserirProfessorComponent } from './inserir-professor/inserir-professor.component';
import { ListarProfessorComponent } from './listar-professor/listar-professor.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AlterarProfessorComponent, ExcluirProfessorComponent, InserirProfessorComponent, ListarProfessorComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ProfessorRoutingModule
  ]
})
export class ProfessorModule { }
