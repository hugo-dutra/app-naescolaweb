import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListarTurnoComponent } from './listar-turno/listar-turno.component';
import { AuthGuardService } from '../../guards/auth.guard.service';
import { InserirTurnoComponent } from './inserir-turno/inserir-turno.component';
import { ExcluirTurnoComponent } from './excluir-turno/excluir-turno.component';
import { AlterarTurnoComponent } from './alterar-turno/alterar-turno.component';

const routes: Routes = [
  { path: "", component: ListarTurnoComponent, canActivate: [AuthGuardService] },
  { path: "inserir-turno", component: InserirTurnoComponent, canActivate: [AuthGuardService] },
  { path: "excluir-turno", component: ExcluirTurnoComponent, data: { objeto: "objeto" }, canActivate: [AuthGuardService] },
  { path: "alterar-turno", component: AlterarTurnoComponent, data: { objeto: "objeto" }, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TurnoRoutingModule { }
