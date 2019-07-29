import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfessorDisciplinaRoutingModule } from './professor-disciplina-routing.module';
import { InserirProfessorDisciplinaComponent } from './inserir-professor-disciplina/inserir-professor-disciplina.component';
import { ListarProfessorDisciplinaComponent } from './listar-professor-disciplina/listar-professor-disciplina.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    InserirProfessorDisciplinaComponent,
    ListarProfessorDisciplinaComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    ProfessorDisciplinaRoutingModule
  ]
})
export class ProfessorDisciplinaModule { }
