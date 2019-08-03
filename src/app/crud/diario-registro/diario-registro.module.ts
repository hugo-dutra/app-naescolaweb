import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiarioRegistroRoutingModule } from './diario-registro-routing.module';
import { AlterarDiarioAvaliacaoComponent } from './alterar-diario-avaliacao/alterar-diario-avaliacao.component';
import { AlterarRegistroDiarioComponent } from './alterar-registro-diario/alterar-registro-diario.component';
import { GerenciarDiarioRegistroComponent } from './gerenciar-diario-registro/gerenciar-diario-registro.component';
import { InserirDiarioAvaliacaoComponent } from './inserir-diario-avaliacao/inserir-diario-avaliacao.component';
import { InserirDiarioObservacaoEstudanteComponent } from './inserir-diario-observacao-estudante/inserir-diario-observacao-estudante.component';
import { InserirDiarioObservacaoGeralComponent } from './inserir-diario-observacao-geral/inserir-diario-observacao-geral.component';
import { InserirRegistroDiarioComponent } from './inserir-registro-diario/inserir-registro-diario.component';
import { LancarManualNotaBimestralConselhoProfessorDiscipliaComponent } from './lancar-manual-nota-bimestral-conselho-professor-disciplia/lancar-manual-nota-bimestral-conselho-professor-disciplia.component';
import { ListarDiarioAvaliacaoEstudanteComponent } from './listar-diario-avaliacao-estudante/listar-diario-avaliacao-estudante.component';
import { ListarDiarioUsuarioEscolaComponent } from './listar-diario-usuario-escola/listar-diario-usuario-escola.component';
import { ListarTurmaDisciplinaProfessorComponent } from './listar-turma-disciplina-professor/listar-turma-disciplina-professor.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AlterarDiarioAvaliacaoComponent,
    AlterarRegistroDiarioComponent,
    GerenciarDiarioRegistroComponent,
    InserirDiarioAvaliacaoComponent,
    InserirDiarioObservacaoEstudanteComponent,
    InserirDiarioObservacaoGeralComponent,
    InserirRegistroDiarioComponent,
    LancarManualNotaBimestralConselhoProfessorDiscipliaComponent,
    ListarDiarioAvaliacaoEstudanteComponent,
    ListarDiarioUsuarioEscolaComponent,
    ListarTurmaDisciplinaProfessorComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    DiarioRegistroRoutingModule
  ]
})
export class DiarioRegistroModule { }
