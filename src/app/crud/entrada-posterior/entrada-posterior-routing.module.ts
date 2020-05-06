import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListarEntradaPosteriorComponent } from './listar-entrada-posterior/listar-entrada-posterior.component';
import { AuthGuardService } from '../../guards/auth.guard.service';
import { InserirEntradaPosteriorComponent } from './inserir-entrada-posterior/inserir-entrada-posterior.component';

const routes: Routes = [

  { path: '', component: ListarEntradaPosteriorComponent, canActivate: [AuthGuardService] },
  {
    path: 'inserir-entrada-posterior', component: InserirEntradaPosteriorComponent, data: { objeto: 'objeto' }, canActivate: [AuthGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntradaPosteriorRoutingModule { }
