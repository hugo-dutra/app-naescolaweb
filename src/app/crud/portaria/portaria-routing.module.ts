import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlterarPortariaComponent } from './alterar-portaria/alterar-portaria.component';
import { ExcluirPortariaComponent } from './excluir-portaria/excluir-portaria.component';
import { InserirPortariaComponent } from './inserir-portaria/inserir-portaria.component';
import { ListarPortariaComponent } from './listar-portaria/listar-portaria.component';
import { InserirCronogramaPortariaComponent } from './inserir-cronograma-portaria/inserir-cronograma-portaria.component';
import { GerenciarPortariaComponent } from './gerenciar-portaria/gerenciar-portaria.component';
import { VerificarFrequenciaPortariaComponent } from './verificar-frequencia-portaria/verificar-frequencia-portaria.component';
import { VerificarAbsenteismoPortariaComponent } from './verificar-absenteismo-portaria/verificar-absenteismo-portaria.component';
import { AuthGuardService } from '../../guards/auth.guard.service';

const routes: Routes = [
  { path: "", component: GerenciarPortariaComponent, canActivate: [AuthGuardService] },
  { path: "alterar-portaria", component: AlterarPortariaComponent, data: { objeto: "objeto" }, canActivate: [AuthGuardService] },
  { path: "excluir-portaria", component: ExcluirPortariaComponent, data: { objeto: "objeto" }, canActivate: [AuthGuardService] },
  { path: "inserir-portaria", component: InserirPortariaComponent, canActivate: [AuthGuardService] },
  { path: "listar-portaria", component: ListarPortariaComponent, canActivate: [AuthGuardService] },
  { path: "inserir-cronograma-portaria", component: InserirCronogramaPortariaComponent, canActivate: [AuthGuardService] },
  { path: "verificar-frequencia-portaria", component: VerificarFrequenciaPortariaComponent, canActivate: [AuthGuardService] },
  { path: "verificar-absenteismo-portaria", component: VerificarAbsenteismoPortariaComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortariaRoutingModule { }
