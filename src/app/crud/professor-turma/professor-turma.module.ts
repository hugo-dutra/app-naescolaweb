import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfessorTurmaRoutingModule } from './professor-turma-routing.module';
import { InserirProfessorTurmaComponent } from './inserir-professor-turma/inserir-professor-turma.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [InserirProfessorTurmaComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ProfessorTurmaRoutingModule
  ]
})
export class ProfessorTurmaModule { }
