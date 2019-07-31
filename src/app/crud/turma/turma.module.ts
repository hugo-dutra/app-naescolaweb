import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TurmaRoutingModule } from './turma-routing.module';
import { AlterarTurmaComponent } from './alterar-turma/alterar-turma.component';
import { ExcluirTurmaComponent } from './excluir-turma/excluir-turma.component';
import { ListarEstudantesTurmaComponent } from './listar-estudantes-turma/listar-estudantes-turma.component';
import { ListarTurmaComponent } from './listar-turma/listar-turma.component';
import { InserirTurmaComponent } from './inserir-turma/inserir-turma.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [AlterarTurmaComponent, ExcluirTurmaComponent, ListarEstudantesTurmaComponent, ListarTurmaComponent, InserirTurmaComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgbPopoverModule,
    TurmaRoutingModule
  ]
})
export class TurmaModule { }
