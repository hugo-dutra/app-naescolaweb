import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuarioProfessorRoutingModule } from './usuario-professor-routing.module';
import { InserirUsuarioProfessorComponent } from './inserir-usuario-professor/inserir-usuario-professor.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [InserirUsuarioProfessorComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    UsuarioProfessorRoutingModule
  ]
})
export class UsuarioProfessorModule { }
