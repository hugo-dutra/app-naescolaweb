import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlterarTipoOcorrenciaDisciplinarComponent } from './alterar-tipo-ocorrencia-disciplinar/alterar-tipo-ocorrencia-disciplinar.component';
import { ExcluirTipoOcorrenciaDisciplinarComponent } from './excluir-tipo-ocorrencia-disciplinar/excluir-tipo-ocorrencia-disciplinar.component';
import { InserirTipoOcorrenciaDisciplinarComponent } from './inserir-tipo-ocorrencia-disciplinar/inserir-tipo-ocorrencia-disciplinar.component';
import { ListarTipoOcorrenciaDisciplinarComponent } from './listar-tipo-ocorrencia-disciplinar/listar-tipo-ocorrencia-disciplinar.component';
import { AuthGuardService } from '../../guards/auth.guard.service';

const routes: Routes = [
  { path: "", component: ListarTipoOcorrenciaDisciplinarComponent, canActivate: [AuthGuardService] },
  { path: "alterar-tipo-ocorrencia-disciplinar", component: AlterarTipoOcorrenciaDisciplinarComponent, data: { objeto: "objeto" }, canActivate: [AuthGuardService] },
  { path: "excluir-tipo-ocorrencia-disciplinar", component: ExcluirTipoOcorrenciaDisciplinarComponent, data: { objeto: "objeto" }, canActivate: [AuthGuardService] },
  { path: "inserir-tipo-ocorrencia-disciplinar", component: InserirTipoOcorrenciaDisciplinarComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoOcorrenciaDisciplinarRoutingModule { }
