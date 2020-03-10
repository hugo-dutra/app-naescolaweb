import { ListarAtestadoMedicoComponent } from './listar-atestado-medico/listar-atestado-medico.component';
import { InserirAtestadoMedicoComponent } from './inserir-atestado-medico/inserir-atestado-medico.component';
import { ExcluirAtestadoMedicoComponent } from './excluir-atestado-medico/excluir-atestado-medico.component';
import { AlterarAtestadoMedicoComponent } from './alterar-atestado-medico/alterar-atestado-medico.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../guards/auth.guard.service';

const routes: Routes = [
  { path: '', component: ListarAtestadoMedicoComponent, canActivate: [AuthGuardService] },
  { path: 'alterar-atestado-medico', component: AlterarAtestadoMedicoComponent, canActivate: [AuthGuardService] },
  { path: 'excluir-atestado-medico', component: ExcluirAtestadoMedicoComponent, canActivate: [AuthGuardService] },
  { path: 'inserir-atestado-medico', component: InserirAtestadoMedicoComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AtestadoMedicoRoutingModule { }
