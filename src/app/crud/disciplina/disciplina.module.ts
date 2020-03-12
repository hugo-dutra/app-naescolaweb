import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DisciplinaRoutingModule } from './disciplina-routing.module';
import { AlterarDisciplinaComponent } from './alterar-disciplina/alterar-disciplina.component';
import { ExcluirDisciplinaComponent } from './excluir-disciplina/excluir-disciplina.component';
import { InserirDisciplinaComponent } from './inserir-disciplina/inserir-disciplina.component';
import { ListarDisciplinaComponent } from './listar-disciplina/listar-disciplina.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AlterarDisciplinaComponent,
    ExcluirDisciplinaComponent,
    InserirDisciplinaComponent,
    ListarDisciplinaComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DisciplinaRoutingModule,
  ],
})
export class DisciplinaModule { }
