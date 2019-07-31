import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { LoginComponent } from '../access/login/login.component';
import { MenuAtalhoComponent } from '../shared/pagina-inicial/menu-atalho/menu-atalho.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    //Modificado
    { path: 'dashboard', component: MenuAtalhoComponent, },

    /*MEUS MÓDULOS*/
    { path: 'logar', component: LoginComponent },
    { path: 'gerenciar-alerta-ocorrencia', loadChildren: () => import('./alerta/alerta.module').then(m => m.AlertaModule), },
    { path: 'listar-area-conhecimento', loadChildren: () => import('./area-conhecimento/area-conhecimento.module').then(m => m.AreaConhecimentoModule), },
    { path: 'listar-disciplina', loadChildren: () => import('./disciplina/disciplina.module').then(m => m.DisciplinaModule), },
    { path: 'listar-escola', loadChildren: () => import('./escola/escola.module').then(m => m.EscolaModule), },
    { path: 'listar-etapa-ensino', loadChildren: () => import('./etapa-ensino/etapa-ensino.module').then(m => m.EtapaEnsinoModule), },
    { path: 'listar-tipo-ocorrencia-disciplinar', loadChildren: () => import('./tipo-ocorrencia-disciplinar/tipo-ocorrencia-disciplinar.module').then(m => m.TipoOcorrenciaDisciplinarModule), },
    { path: 'listar-turma', loadChildren: () => import('./turma/turma.module').then(m => m.TurmaModule), },
    { path: 'listar-turno', loadChildren: () => import('./turno/turno.module').then(m => m.TurnoModule), },
    { path: 'listar-usuario', loadChildren: () => import('./usuario/usuario.module').then(m => m.UsuarioModule), },
    { path: 'inserir-usuario-escola', loadChildren: () => import('./usuario-escola/usuario-escola.module').then(m => m.UsuarioEscolaModule), },
    { path: 'inserir-usuario-professor', loadChildren: () => import('./usuario-professor/usuario-professor.module').then(m => m.UsuarioProfessorModule), },
    { path: 'listar-perfil', loadChildren: () => import('./perfil/perfil.module').then(m => m.PerfilModule), },
    { path: 'inserir-perfil-permissao', loadChildren: () => import('./perfil-permissao/perfil-permissao.module').then(m => m.PerfilPermissaoModule), },
    { path: 'listar-professor', loadChildren: () => import('./professor/professor.module').then(m => m.ProfessorModule), },
    { path: 'listar-serie', loadChildren: () => import('./serie/serie.module').then(m => m.SerieModule), },
    { path: 'inserir-professor-disciplina', loadChildren: () => import('./professor-disciplina/professor-disciplina.module').then(m => m.ProfessorDisciplinaModule), },
    { path: 'listar-permissao-acesso', loadChildren: () => import('./permissao-acesso/permissao-acesso.module').then(m => m.PermissaoAcessoModule), },
    { path: 'listar-estudante', loadChildren: () => import('./estudante/estudante.module').then(m => m.EstudanteModule), },
    /**************/

    { path: 'layout', loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule), },
    { path: 'forms', loadChildren: () => import('./forms/forms.module').then(m => m.FormsModule), },
    { path: 'ui-features', loadChildren: () => import('./ui-features/ui-features.module').then(m => m.UiFeaturesModule), },
    { path: 'modal-overlays', loadChildren: () => import('./modal-overlays/modal-overlays.module').then(m => m.ModalOverlaysModule), },
    { path: 'extra-components', loadChildren: () => import('./extra-components/extra-components.module').then(m => m.ExtraComponentsModule), },
    { path: 'maps', loadChildren: () => import('./maps/maps.module').then(m => m.MapsModule), },
    { path: 'charts', loadChildren: () => import('./charts/charts.module').then(m => m.ChartsModule), },
    { path: 'editors', loadChildren: () => import('./editors/editors.module').then(m => m.EditorsModule), },
    { path: 'tables', loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule), },
    { path: 'miscellaneous', loadChildren: () => import('./miscellaneous/miscellaneous.module').then(m => m.MiscellaneousModule), },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full', },
    { path: '**', component: NotFoundComponent, },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
