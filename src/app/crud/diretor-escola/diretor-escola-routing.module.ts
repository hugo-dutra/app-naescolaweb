import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InserirDiretorEscolaComponent } from './inserir-diretor-escola/inserir-diretor-escola.component';
import { AuthGuardService } from '../../guards/auth.guard.service';

const routes: Routes = [
  { path: '', component: InserirDiretorEscolaComponent, data: { objeto: 'objeto' }, canActivate: [AuthGuardService] },
  /* { path: "listar-diretor-escola", component: ListarDiretorEscolaComponent },
  { path: "excluir-diretor-escola", component: ExcluirDiretorEscolaComponent,
  data: { objeto: "objeto" }, canActivate: [AuthGuardService] },
  { path: "alterar-diretor-escola", component: AlterarDiretorEscolaComponent, data: { objeto: "objeto" },
  canActivate: [AuthGuardService] },  */
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiretorEscolaRoutingModule { }
