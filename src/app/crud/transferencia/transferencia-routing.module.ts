import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../guards/auth.guard.service';
import { GerenciarTransferenciaComponent } from './gerenciar-transferencia/gerenciar-transferencia.component';
import { TransferirEscolaComponent } from './transferir-escola/transferir-escola.component';
import { TransferirTurmaComponent } from './transferir-turma/transferir-turma.component';

const routes: Routes = [
  { path: "", component: GerenciarTransferenciaComponent, canActivate: [AuthGuardService] },
  { path: "transferencia-escola", component: TransferirEscolaComponent, data: { objeto: "objeto" }, canActivate: [AuthGuardService] },
  { path: "transferencia-turma", component: TransferirTurmaComponent, data: { objeto: "objeto" }, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransferenciaRoutingModule { }
