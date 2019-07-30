import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListarSerieComponent } from './listar-serie/listar-serie.component';
import { AlterarSerieComponent } from './alterar-serie/alterar-serie.component';
import { ExcluirSerieComponent } from './excluir-serie/excluir-serie.component';
import { InserirSerieComponent } from './inserir-serie/inserir-serie.component';
import { AuthGuardService } from '../../guards/auth.guard.service';

const routes: Routes = [
  { path: "", component: ListarSerieComponent, canActivate: [AuthGuardService] },
  { path: "alterar-serie", component: AlterarSerieComponent, data: { objeto: "objeto" }, canActivate: [AuthGuardService] },
  { path: "excluir-serie", component: ExcluirSerieComponent, data: { objeto: "objeto" }, canActivate: [AuthGuardService] },
  { path: "inserir-serie", component: InserirSerieComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SerieRoutingModule { }
