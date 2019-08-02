import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../guards/auth.guard.service';
import { ListarRegiaoEscolaComponent } from './listar-regiao-escola/listar-regiao-escola.component';
import { AlterarRegiaoEscolaComponent } from './alterar-regiao-escola/alterar-regiao-escola.component';
import { ExcluirRegiaoEscolaComponent } from './excluir-regiao-escola/excluir-regiao-escola.component';
import { InserirRegiaoEscolaComponent } from './inserir-regiao-escola/inserir-regiao-escola.component';

const routes: Routes = [
  { path: "", component: ListarRegiaoEscolaComponent, canActivate: [AuthGuardService] },
  { path: "alterar-regiao-escola", component: AlterarRegiaoEscolaComponent, data: { objeto: "objeto" }, canActivate: [AuthGuardService] },
  { path: "excluir-regiao-escola", component: ExcluirRegiaoEscolaComponent, data: { objeto: "objeto" }, canActivate: [AuthGuardService] },
  { path: "inserir-regiao-escola", component: InserirRegiaoEscolaComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegiaoEscolaRoutingModule { }
