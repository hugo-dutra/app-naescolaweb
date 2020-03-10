import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GerenciarIntegracaoComponent } from './gerenciar-integracao/gerenciar-integracao.component';
import { AuthGuardService } from '../../guards/auth.guard.service';

const routes: Routes = [
  { path: '', component: GerenciarIntegracaoComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SedfRoutingModule { }
