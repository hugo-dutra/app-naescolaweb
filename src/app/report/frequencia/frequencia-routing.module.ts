import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FrequenciaPortariaPeriodoComponent } from './frequencia-portaria-periodo/frequencia-portaria-periodo.component';
import { AuthGuardService } from '../../guards/auth.guard.service';
import { FrequenciaBoletimTurmaGeralComponent } from './frequencia-boletim-turma-geral/frequencia-boletim-turma-geral.component';
import { GerenciarRelatorioFrequenciaGeralComponent } from './gerenciar-relatorio-frequencia-geral/gerenciar-relatorio-frequencia-geral.component';

const routes: Routes = [
  { path: "", component: GerenciarRelatorioFrequenciaGeralComponent, canActivate: [AuthGuardService] },
  { path: "grafico-frequencia-portaria-periodo", component: FrequenciaPortariaPeriodoComponent, canActivate: [AuthGuardService] },
  { path: "frequencia-boletim-turma-geral", component: FrequenciaBoletimTurmaGeralComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrequenciaRoutingModule { }
