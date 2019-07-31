import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListarPeriodoLetivoComponent } from './listar-periodo-letivo/listar-periodo-letivo.component';
import { AlterarPeriodoLetivoComponent } from './alterar-periodo-letivo/alterar-periodo-letivo.component';
import { ExcluirPeriodoLetivoComponent } from './excluir-periodo-letivo/excluir-periodo-letivo.component';
import { InserirPeriodoLetivoComponent } from './inserir-periodo-letivo/inserir-periodo-letivo.component';
import { AuthGuardService } from '../../guards/auth.guard.service';

const routes: Routes = [
  { path: "", component: ListarPeriodoLetivoComponent, canActivate: [AuthGuardService] },
  { path: "alterar-periodo-letivo", component: AlterarPeriodoLetivoComponent, data: { objeto: "objeto" }, canActivate: [AuthGuardService] },
  { path: "excluir-periodo-letivo", component: ExcluirPeriodoLetivoComponent, data: { objeto: "objeto" }, canActivate: [AuthGuardService] },
  { path: "inserir-periodo-letivo", component: InserirPeriodoLetivoComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeriodoLetivoRoutingModule { }
