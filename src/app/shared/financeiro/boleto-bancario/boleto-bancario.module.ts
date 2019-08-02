import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListarBoletoBancarioMensalidadeComponent } from './listar-boleto-bancario-mensalidade/listar-boleto-bancario-mensalidade.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BoletoBancarioRoutingModule } from './boleto-bancario.routing.module';

@NgModule({
  declarations: [ListarBoletoBancarioMensalidadeComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    BoletoBancarioRoutingModule,
  ]
})
export class BoletoBancarioModule { }
