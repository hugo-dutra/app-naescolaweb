import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SedfRoutingModule } from './sedf-routing.module';
import { GerenciarIntegracaoComponent } from './gerenciar-integracao/gerenciar-integracao.component';
import { NbCardModule } from '@nebular/theme';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [GerenciarIntegracaoComponent],
  imports: [
    CommonModule,
    SedfRoutingModule,
    HttpClientModule,
    NbCardModule,
  ]
})
export class SedfModule { }
