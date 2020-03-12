import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlterarEstudanteComponent } from './alterar-estudante/alterar-estudante.component';
import { ExcluirEstudanteComponent } from './excluir-estudante/excluir-estudante.component';
import { InserirEstudanteComponent } from './inserir-estudante/inserir-estudante.component';
import { ListarEstudanteComponent } from './listar-estudante/listar-estudante.component';
import { DetalharEstudanteComponent } from './detalhar-estudante/detalhar-estudante.component';
import { EnturmarEstudanteComponent } from './enturmar-estudante/enturmar-estudante.component';
import { ImportarEstudanteComponent } from './importar-estudante/importar-estudante.component';
import {
  InserirObservacaoEstudanteComponent,
} from './inserir-observacao-estudante/inserir-observacao-estudante.component';
import {
  ListarObservacaoEstudanteComponent,
} from './listar-observacao-estudante/listar-observacao-estudante.component';
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
  DetalharEstudanteNotificacaoComponent,
} from './detalhar-estudante-notificacao/detalhar-estudante-notificacao.component';
import {
  DetalharEstudanteRendimentoComponent,
} from './detalhar-estudante-rendimento/detalhar-estudante-rendimento.component';
import {
  DetalharEstudanteNotaObservacaoComponent,
} from './detalhar-estudante-nota-observacao/detalhar-estudante-nota-observacao.component';
import {
  DetalharEstudanteSaidaAntecipadaComponent,
} from './detalhar-estudante-saida-antecipada/detalhar-estudante-saida-antecipada.component';
import { AuthGuardService } from '../../guards/auth.guard.service';

const routes: Routes = [
  { path: '', component: ListarEstudanteComponent, canActivate: [AuthGuardService] },

  {
    path: 'alterar-estudante', component: AlterarEstudanteComponent,
    data: { objeto: 'objeto' }, canActivate: [AuthGuardService],
  },
  {
    path: 'excluir-estudante', component: ExcluirEstudanteComponent,
    data: { objeto: 'objeto' }, canActivate: [AuthGuardService],
  },
  { path: 'inserir-estudante', component: InserirEstudanteComponent, canActivate: [AuthGuardService] },
  { path: 'detalhar-estudante', component: DetalharEstudanteComponent, canActivate: [AuthGuardService] },
  { path: 'enturmar-estudante', component: EnturmarEstudanteComponent, canActivate: [AuthGuardService] },
  { path: 'importar-estudante', component: ImportarEstudanteComponent, canActivate: [AuthGuardService] },
  {
    path: 'inserir-observacao-estudante', component: InserirObservacaoEstudanteComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'listar-observacao-estudante', component: ListarObservacaoEstudanteComponent,
    canActivate: [AuthGuardService],
  },

  {
    path: 'detalhar-estudante-disciplinar', component: DetalharEstudanteDisciplinarComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'detalhar-estudante-entrada-saida', component: DetalharEstudanteEntradaSaidaComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'detalhar-estudante-informacao', component: DetalharEstudanteInformacaoComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'detalhar-estudante-notificacao', component: DetalharEstudanteNotificacaoComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'detalhar-estudante-rendimento', component: DetalharEstudanteRendimentoComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'detalhar-estudante-nota-observacao', component: DetalharEstudanteNotaObservacaoComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'detalhar-estudante-saida-antecipada', component: DetalharEstudanteSaidaAntecipadaComponent,
    canActivate: [AuthGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstudanteRoutingModule { }
