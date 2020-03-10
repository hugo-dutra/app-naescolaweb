import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  ListarBoletoBancarioMensalidadeComponent,
} from './listar-boleto-bancario-mensalidade/listar-boleto-bancario-mensalidade.component';
import { AuthGuardService } from '../../../guards/auth.guard.service';

const boletoBancarioRoutes: Routes = [
  { path: '', component: ListarBoletoBancarioMensalidadeComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(boletoBancarioRoutes)], /***/
  exports: [RouterModule],
})

export class BoletoBancarioRoutingModule { }/***/
