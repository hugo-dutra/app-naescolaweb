import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxBarcodeModule } from 'ngx-barcode';


import { PedidoCartaoRoutingModule } from './pedido-cartao-routing.module';
import { ConfeccionarCartaoAcessoComponent } from './confeccionar-cartao-acesso/confeccionar-cartao-acesso.component';
import { DetalharPedidoCartaoComponent } from './detalhar-pedido-cartao/detalhar-pedido-cartao.component';
import {
  DetalharPedidoCartaoEntidadeComponent,
} from './detalhar-pedido-cartao-entidade/detalhar-pedido-cartao-entidade.component';
import { GerenciarPedidoCartaoComponent } from './gerenciar-pedido-cartao/gerenciar-pedido-cartao.component';
import { InserirPedidoCartaoComponent } from './inserir-pedido-cartao/inserir-pedido-cartao.component';
import { ListarPedidoCartaoComponent } from './listar-pedido-cartao/listar-pedido-cartao.component';
import {
  ListarPedidoCartaoEntidadeComponent,
} from './listar-pedido-cartao-entidade/listar-pedido-cartao-entidade.component';
import {
  ListarPendenciaPedidoCartaoComponent,
} from './listar-pendencia-pedido-cartao/listar-pendencia-pedido-cartao.component';
import {
  ListarPendenciaPedidoCartaoEntidadeComponent,
} from './listar-pendencia-pedido-cartao-entidade/listar-pendencia-pedido-cartao-entidade.component';
import {
  RegistrarPendenciaPedidoCartaoComponent,
} from './registrar-pendencia-pedido-cartao/registrar-pendencia-pedido-cartao.component';
import { NbCardModule } from '@nebular/theme';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ConfeccionarCartaoAcessoComponent,
    DetalharPedidoCartaoComponent,
    DetalharPedidoCartaoEntidadeComponent,
    GerenciarPedidoCartaoComponent,
    InserirPedidoCartaoComponent,
    ListarPedidoCartaoComponent,
    ListarPedidoCartaoEntidadeComponent,
    ListarPendenciaPedidoCartaoComponent,
    ListarPendenciaPedidoCartaoEntidadeComponent,
    RegistrarPendenciaPedidoCartaoComponent],
  imports: [
    CommonModule,
    NgxBarcodeModule,
    NbCardModule,
    PedidoCartaoRoutingModule,
    FormsModule,
  ],
})
export class PedidoCartaoModule { }
