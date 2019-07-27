import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListarEscolaComponent } from './listar-escola/listar-escola.component';
import { AlterarEscolaComponent } from './alterar-escola/alterar-escola.component';
import { ExcluirEscolaComponent } from './excluir-escola/excluir-escola.component';
import { InserirEscolaComponent } from './inserir-escola/inserir-escola.component';
import { AuthGuardService } from '../../guards/auth.guard.service';

const routes: Routes = [
  { path: "", component: ListarEscolaComponent, canActivate: [AuthGuardService] },
  { path: "alterar-escola", component: AlterarEscolaComponent, data: { objeto: "objeto" }, canActivate: [AuthGuardService] },
  { path: "excluir-escola", component: ExcluirEscolaComponent, data: { objeto: "objeto" }, canActivate: [AuthGuardService] },
  { path: "inserir-escola", component: InserirEscolaComponent, canActivate: [AuthGuardService] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EscolaRoutingModule { }
