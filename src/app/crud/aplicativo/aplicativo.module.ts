import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AplicativoRoutingModule } from './aplicativo-routing.module';
import { BaixarFotoEstudanteAplicativoComponent } from './baixar-foto-estudante-aplicativo/baixar-foto-estudante-aplicativo.component';
import { GerarQrcodeAplicativoAdministrativoComponent } from './gerar-qrcode-aplicativo-administrativo/gerar-qrcode-aplicativo-administrativo.component';
import { GerarQrcodeAplicativoEstudanteComponent } from './gerar-qrcode-aplicativo-estudante/gerar-qrcode-aplicativo-estudante.component';
import { GerenciarAplicativoComponent } from './gerenciar-aplicativo/gerenciar-aplicativo.component';
import { SincronizarEstudanteAplicativoComponent } from './sincronizar-estudante-aplicativo/sincronizar-estudante-aplicativo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { QRCodeModule } from 'angular2-qrcode';
import { NbCardModule } from '@nebular/theme';
import { HintModule } from 'angular-custom-tour';

@NgModule({
  declarations: [BaixarFotoEstudanteAplicativoComponent, GerarQrcodeAplicativoAdministrativoComponent, GerarQrcodeAplicativoEstudanteComponent, GerenciarAplicativoComponent, SincronizarEstudanteAplicativoComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    QRCodeModule,
    NbCardModule,
    HintModule,
    AplicativoRoutingModule
  ]
})
export class AplicativoModule { }
