import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FiltrarSaidaAntecipadaComponent } from './filtrar-saida-antecipada/filtrar-saida-antecipada.component';
import { ExcluirSaidaAntecipadaComponent } from './excluir-saida-antecipada/excluir-saida-antecipada.component';
import { InserirSaidaAntecipadaComponent } from './inserir-saida-antecipada/inserir-saida-antecipada.component';
import { AuthGuardService } from '../../guards/auth.guard.service';

const routes: Routes = [
  { path: "", component: FiltrarSaidaAntecipadaComponent, canActivate: [AuthGuardService] },
  { path: "excluir-saida-antecipada", component: ExcluirSaidaAntecipadaComponent, data: { objeto: "objeto" }, canActivate: [AuthGuardService] },
  { path: "inserir-saida-antecipada", component: InserirSaidaAntecipadaComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaidaAntecipadaRoutingModule { }
