import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListarComunicadoDiversoComponent } from './listar-comunicado-diverso/listar-comunicado-diverso.component';
import { InserirComunicadoDiversoComponent } from './inserir-comunicado-diverso/inserir-comunicado-diverso.component';
import { AuthGuardService } from '../../guards/auth.guard.service';

const routes: Routes = [
  { path: "", component: ListarComunicadoDiversoComponent, canActivate: [AuthGuardService] },
  { path: "inserir-comunicado-diverso", component: InserirComunicadoDiversoComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComunicadoDiversoRoutingModule { }
