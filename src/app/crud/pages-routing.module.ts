import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { LoginComponent } from '../access/login/login.component';
import { MenuAtalhoComponent } from '../shared/pagina-inicial/menu-atalho/menu-atalho.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    // Modificado
    { path: 'dashboard', component: MenuAtalhoComponent },

    /*CRUDS*/
    { path: 'logar', component: LoginComponent },
    {
      path: 'gerenciar-alerta-ocorrencia', loadChildren: () => import('./alerta/alerta.module')
        .then(m => m.AlertaModule),
    },
    {
      path: 'gerenciar-aplicativo',
      loadChildren: () => import('./aplicativo/aplicativo.module').then(m => m.AplicativoModule),
    },
    {
      path: 'listar-area-conhecimento',
      loadChildren: () => import('./area-conhecimento/area-conhecimento.module').then(m => m.AreaConhecimentoModule),
    },
    {
      path: 'listar-atestado-medico',
      loadChildren: () => import('./atestado-medico/atestado-medico.module').then(m => m.AtestadoMedicoModule),
    },
    {
      path: 'gerenciar-atividade-extra-classe',
      loadChildren: () => import('./atividade-extra-classe/atividade-extra-classe.module')
        .then(m => m.AtividadeExtraClasseModule),
    },
    {
      path: 'enviar-nota-boletim',
      loadChildren: () => import('./boletim-estudante/boletim-estudante.module').then(m => m.BoletimEstudanteModule),
    },
    {
      path: 'listar-disciplina',
      loadChildren: () => import('./disciplina/disciplina.module').then(m => m.DisciplinaModule),
    },
    {
      path: 'listar-comunicado-diverso',
      loadChildren: () => import('./comunicado-diverso/comunicado-diverso.module').then(m => m.ComunicadoDiversoModule),
    },
    {
      path: 'gerenciar-diario-professor',
      loadChildren: () => import('./diario-professor/diario-professor.module').then(m => m.DiarioProfessorModule),
    },
    {
      path: 'gerenciar-diario-registro',
      loadChildren: () => import('./diario-registro/diario-registro.module').then(m => m.DiarioRegistroModule),
    },
    {
      path: 'listar-diretor',
      loadChildren: () => import('./diretor/diretor.module').then(m => m.DiretorModule),
    },
    {
      path: 'inserir-diretor-escola',
      loadChildren: () => import('./diretor-escola/diretor-escola.module').then(m => m.DiretorEscolaModule),
    },
    {
      path: 'listar-escola',
      loadChildren: () => import('./escola/escola.module').then(m => m.EscolaModule),
    },
    {
      path: 'listar-etapa-ensino',
      loadChildren: () => import('./etapa-ensino/etapa-ensino.module').then(m => m.EtapaEnsinoModule),
    },
    {
      path: 'listar-tipo-ocorrencia-disciplinar',
      loadChildren: () => import('./tipo-ocorrencia-disciplinar/tipo-ocorrencia-disciplinar.module')
        .then(m => m.TipoOcorrenciaDisciplinarModule),
    },
    {
      path: 'gerenciar-transferencia',
      loadChildren: () => import('./transferencia/transferencia.module').then(m => m.TransferenciaModule),
    },
    { path: 'listar-turma', loadChildren: () => import('./turma/turma.module').then(m => m.TurmaModule) },
    { path: 'listar-turno', loadChildren: () => import('./turno/turno.module').then(m => m.TurnoModule) },
    { path: 'listar-usuario', loadChildren: () => import('./usuario/usuario.module').then(m => m.UsuarioModule) },
    {
      path: 'inserir-usuario-escola',
      loadChildren: () => import('./usuario-escola/usuario-escola.module').then(m => m.UsuarioEscolaModule),
    },
    {
      path: 'inserir-usuario-professor',
      loadChildren: () => import('./usuario-professor/usuario-professor.module').then(m => m.UsuarioProfessorModule),
    },
    {
      path: 'inserir-ocorrencia',
      loadChildren: () => import('./ocorrencia/ocorrencia.module').then(m => m.OcorrenciaModule),
    },
    {
      path: 'gerenciar-pedido-cartao',
      loadChildren: () => import('./pedido-cartao/pedido-cartao.module').then(m => m.PedidoCartaoModule),
    },
    {
      path: 'listar-perfil',
      loadChildren: () => import('./perfil/perfil.module').then(m => m.PerfilModule),
    },
    {
      path: 'inserir-perfil-permissao',
      loadChildren: () => import('./perfil-permissao/perfil-permissao.module').then(m => m.PerfilPermissaoModule),
    },
    {
      path: 'gerenciar-portaria',
      loadChildren: () => import('./portaria/portaria.module').then(m => m.PortariaModule),
    },
    {
      path: 'listar-professor',
      loadChildren: () => import('./professor/professor.module').then(m => m.ProfessorModule),
    },
    {
      path: 'inserir-rede-ensino',
      loadChildren: () => import('./rede-ensino/rede-ensino.module').then(m => m.RedeEnsinoModule),
    },
    {
      path: 'filtrar-saida-antecipada',
      loadChildren: () => import('./saida-antecipada/saida-antecipada.module').then(m => m.SaidaAntecipadaModule),
    },
    {
      path: 'listar-serie',
      loadChildren: () => import('./serie/serie.module').then(m => m.SerieModule),
    },
    {
      path: 'inserir-professor-disciplina',
      loadChildren: () => import('./professor-disciplina/professor-disciplina.module')
        .then(m => m.ProfessorDisciplinaModule),
    },
    {
      path: 'inserir-professor-escola',
      loadChildren: () => import('./professor-escola/professor-escola.module').then(m => m.ProfessorEscolaModule),
    },
    {
      path: 'listar-regiao-escola',
      loadChildren: () => import('./regiao-escola/regiao-escola.module').then(m => m.RegiaoEscolaModule),
    },
    {
      path: 'inserir-professor-turma',
      loadChildren: () => import('./professor-turma/professor-turma.module').then(m => m.ProfessorTurmaModule),
    },
    {
      path: 'listar-permissao-acesso',
      loadChildren: () => import('./permissao-acesso/permissao-acesso.module').then(m => m.PermissaoAcessoModule),
    },
    {
      path: 'listar-periodo-letivo',
      loadChildren: () => import('./periodo-letivo/periodo-letivo.module').then(m => m.PeriodoLetivoModule),
    },
    {
      path: 'listar-estudante',
      loadChildren: () => import('./estudante/estudante.module').then(m => m.EstudanteModule),
    },

    /* REDIRECTS */
    { path: 'enturmar-estudante', redirectTo: 'listar-estudante/enturmar-estudante', pathMatch: 'full' },
    {
      path: 'inserir-observacao-estudante',
      redirectTo: 'listar-estudante/inserir-observacao-estudante', pathMatch: 'full',
    },
    {
      path: 'receber-alerta-ocorrencia',
      redirectTo: 'gerenciar-alerta-ocorrencia/receber-alerta-ocorrencia', pathMatch: 'full',
    },
    {
      path: 'listar-pedido-cartao-entidade',
      redirectTo: 'gerenciar-pedido-cartao/listar-pedido-cartao-entidade', pathMatch: 'full',
    },

    /* REDIRECTS REPORTS */
    {
      path: 'listar-grafico-ocorrencia',
      redirectTo: 'gerenciar-relatorio-disciplinar/listar-grafico-ocorrencia', pathMatch: 'full',
    },
    {
      path: 'calcular-avaliacao-social',
      redirectTo: 'gerenciar-relatorio-disciplinar/calcular-avaliacao-social', pathMatch: 'full',
    },
    {
      path: 'listar-quantidade-tipo-ocorrencia',
      redirectTo: 'gerenciar-relatorio-disciplinar/listar-quantidade-tipo-ocorrencia', pathMatch: 'full',
    },

    /* REPORTS */
    {
      path: 'gerenciar-relatorio-rendimento', loadChildren: () => import('../report/rendimento/rendimento.module')
        .then(m => m.RendimentoModule),
    },
    {
      path: 'gerenciar-relatorio-disciplinar', loadChildren: () => import('../report/disciplinar/disciplinar.module')
        .then(m => m.DisciplinarModule),
    },
    {
      path: 'grafico-conselho-analise-estudante',
      loadChildren: () => import('../report/conselho-classe/conselho-classe.module')
        .then(m => m.ConselhoClasseModule),
    },
    {
      path: 'gerenciar-relatorio-frequencia-geral', loadChildren: () => import('../report/frequencia/frequencia.module')
        .then(m => m.FrequenciaModule),
    },

    /* SHARED */
    {
      path: 'listar-boleto-bancario-mensalidade',
      loadChildren: () => import('../shared/financeiro/boleto-bancario/boleto-bancario.module')
        .then(m => m.BoletoBancarioModule),
    },
    {
      path: 'gerenciar-integracao-sedf', loadChildren: () => import('../shared/sedf/sedf.module')
        .then(m => m.SedfModule),
    },

    { path: 'charts', loadChildren: () => import('./charts/charts.module').then(m => m.ChartsModule) },
    { path: 'editors', loadChildren: () => import('./editors/editors.module').then(m => m.EditorsModule) },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
