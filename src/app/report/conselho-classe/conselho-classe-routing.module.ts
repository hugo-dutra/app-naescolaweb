import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../guards/auth.guard.service';
import { ConselhoAnaliseEstudanteComponent } from './conselho-analise-estudante/conselho-analise-estudante.component';

const routes: Routes = [
  { path: "", component: ConselhoAnaliseEstudanteComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConselhoClasseRoutingModule { }
