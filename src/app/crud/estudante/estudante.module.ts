import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EstudanteRoutingModule } from './estudante-routing.module';
import { AlterarEstudanteComponent } from './alterar-estudante/alterar-estudante.component';
import { DetalharEstudanteComponent } from './detalhar-estudante/detalhar-estudante.component';
import {
  DetalharEstudanteDisciplinarComponent,
} from './detalhar-estudante-disciplinar/detalhar-estudante-disciplinar.component';
import {
  DetalharEstudanteEntradaSaidaComponent,
} from './detalhar-estudante-entrada-saida/detalhar-estudante-entrada-saida.component';
import {
  DetalharEstudanteInformacaoComponent,
} from './detalhar-estudante-informacao/detalhar-estudante-informacao.component';
import {
  DetalharEstudanteNotaObservacaoComponent,
} from './detalhar-estudante-nota-observacao/detalhar-estudante-nota-observacao.component';
import {
  DetalharEstudanteNotificacaoComponent,
} from './detalhar-estudante-notificacao/detalhar-estudante-notificacao.component';
import {
  DetalharEstudanteRendimentoComponent,
} from './detalhar-estudante-rendimento/detalhar-estudante-rendimento.component';
import {
  DetalharEstudanteSaidaAntecipadaComponent,
} from './detalhar-estudante-saida-antecipada/detalhar-estudante-saida-antecipada.component';
import { EnturmarEstudanteComponent } from './enturmar-estudante/enturmar-estudante.component';
import { ExcluirEstudanteComponent } from './excluir-estudante/excluir-estudante.component';
import { ImportarEstudanteComponent } from './importar-estudante/importar-estudante.component';
import { InserirEstudanteComponent } from './inserir-estudante/inserir-estudante.component';
import {
  InserirObservacaoEstudanteComponent,
} from './inserir-observacao-estudante/inserir-observacao-estudante.component';
import { ListarEstudanteComponent } from './listar-estudante/listar-estudante.component';
import {
  ListarObservacaoEstudanteComponent,
} from './listar-observacao-estudante/listar-observacao-estudante.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AlterarEstudanteComponent,
    DetalharEstudanteComponent,
    DetalharEstudanteDisciplinarComponent,
    DetalharEstudanteEntradaSaidaComponent,
    DetalharEstudanteInformacaoComponent,
    DetalharEstudanteNotaObservacaoComponent,
    DetalharEstudanteNotificacaoComponent,
    DetalharEstudanteRendimentoComponent,
    DetalharEstudanteSaidaAntecipadaComponent,
    EnturmarEstudanteComponent,
    ExcluirEstudanteComponent,
    ImportarEstudanteComponent,
    InserirEstudanteComponent,
    InserirObservacaoEstudanteComponent,
    ListarEstudanteComponent,
    ListarObservacaoEstudanteComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPopoverModule,
    EstudanteRoutingModule,
  ],
})
export class EstudanteModule { }
