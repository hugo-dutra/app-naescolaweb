import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntradaPosteriorRoutingModule } from './entrada-posterior-routing.module';
import { InserirEntradaPosteriorComponent } from './inserir-entrada-posterior/inserir-entrada-posterior.component';
import { ListarEntradaPosteriorComponent } from './listar-entrada-posterior/listar-entrada-posterior.component';

@NgModule({
  declarations: [InserirEntradaPosteriorComponent, ListarEntradaPosteriorComponent],
  imports: [
    CommonModule,
    EntradaPosteriorRoutingModule
  ]
})
export class EntradaPosteriorModule { }
