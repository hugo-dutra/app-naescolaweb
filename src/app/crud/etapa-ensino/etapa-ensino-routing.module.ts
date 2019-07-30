import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListarEtapaEnsinoComponent } from './listar-etapa-ensino/listar-etapa-ensino.component';
import { AlterarEtapaEnsinoComponent } from './alterar-etapa-ensino/alterar-etapa-ensino.component';
import { ExcluirEtapaEnsinoComponent } from './excluir-etapa-ensino/excluir-etapa-ensino.component';
import { InserirEtapaEnsinoComponent } from './inserir-etapa-ensino/inserir-etapa-ensino.component';
import { AuthGuardService } from '../../guards/auth.guard.service';

const routes: Routes = [
  { path: "", component: ListarEtapaEnsinoComponent, canActivate: [AuthGuardService] },
  { path: "alterar-etapa-ensino", component: AlterarEtapaEnsinoComponent, data: { objeto: "objeto" }, canActivate: [AuthGuardService] },
  { path: "excluir-etapa-ensino", component: ExcluirEtapaEnsinoComponent, data: { objeto: "objeto" }, canActivate: [AuthGuardService] },
  { path: "inserir-etapa-ensino", component: InserirEtapaEnsinoComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EtapaEnsinoRoutingModule { }
