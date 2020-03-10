import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnviarNotaBoletimComponent } from './enviar-nota-boletim/enviar-nota-boletim.component';
import { AuthGuardService } from '../../guards/auth.guard.service';

const routes: Routes = [
  { path: '', component: EnviarNotaBoletimComponent, canActivate: [AuthGuardService] },
  // { path: "importar-nota-boletim", component: ImportarNotaBoletimComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BoletimEstudanteRoutingModule { }
