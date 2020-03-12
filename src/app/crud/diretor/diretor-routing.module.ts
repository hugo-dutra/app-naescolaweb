import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListarDiretorComponent } from './listar-diretor/listar-diretor.component';
import { InserirDiretorComponent } from './inserir-diretor/inserir-diretor.component';
import { ExcluirDiretorComponent } from './excluir-diretor/excluir-diretor.component';
import { AlterarDiretorComponent } from './alterar-diretor/alterar-diretor.component';
import { AuthGuardService } from '../../guards/auth.guard.service';

const routes: Routes = [
  { path: '', component: ListarDiretorComponent, canActivate: [AuthGuardService] },
  { path: 'inserir-diretor', component: InserirDiretorComponent, canActivate: [AuthGuardService] },
  {
    path: 'excluir-diretor', component: ExcluirDiretorComponent,
    data: { objeto: 'objeto' }, canActivate: [AuthGuardService],
  },
  {
    path: 'alterar-diretor', component: AlterarDiretorComponent,
    data: { objeto: 'objeto' }, canActivate: [AuthGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiretorRoutingModule { }
