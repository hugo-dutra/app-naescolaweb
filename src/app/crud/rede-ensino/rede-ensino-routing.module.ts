import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InserirRedeEnsinoComponent } from './inserir-rede-ensino/inserir-rede-ensino.component';
import { AuthGuardService } from '../../guards/auth.guard.service';

const routes: Routes = [
  { path: "", component: InserirRedeEnsinoComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RedeEnsinoRoutingModule { }
