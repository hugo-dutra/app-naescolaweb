import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InserirPedidoCartaoComponent } from './inserir-pedido-cartao/inserir-pedido-cartao.component';
import { ListarPedidoCartaoComponent } from './listar-pedido-cartao/listar-pedido-cartao.component';
import { DetalharPedidoCartaoComponent } from './detalhar-pedido-cartao/detalhar-pedido-cartao.component';
import { GerenciarPedidoCartaoComponent } from './gerenciar-pedido-cartao/gerenciar-pedido-cartao.component';
import { ConfeccionarCartaoAcessoComponent } from './confeccionar-cartao-acesso/confeccionar-cartao-acesso.component';
import { ListarPedidoCartaoEntidadeComponent } from './listar-pedido-cartao-entidade/listar-pedido-cartao-entidade.component';
import { DetalharPedidoCartaoEntidadeComponent } from './detalhar-pedido-cartao-entidade/detalhar-pedido-cartao-entidade.component';
import { RegistrarPendenciaPedidoCartaoComponent } from './registrar-pendencia-pedido-cartao/registrar-pendencia-pedido-cartao.component';
import { ListarPendenciaPedidoCartaoComponent } from './listar-pendencia-pedido-cartao/listar-pendencia-pedido-cartao.component';
import { ListarPendenciaPedidoCartaoEntidadeComponent } from './listar-pendencia-pedido-cartao-entidade/listar-pendencia-pedido-cartao-entidade.component';
import { AuthGuardService } from '../../guards/auth.guard.service';

const routes: Routes = [
  { path: "", component: GerenciarPedidoCartaoComponent, canActivate: [AuthGuardService] },
  { path: "inserir-pedido-cartao", component: InserirPedidoCartaoComponent, canActivate: [AuthGuardService] },
  { path: "listar-pedido-cartao", component: ListarPedidoCartaoComponent, canActivate: [AuthGuardService] },
  { path: "detalhar-pedido-cartao", component: DetalharPedidoCartaoComponent, canActivate: [AuthGuardService] },
  { path: "confeccionar-cartao-acesso", component: ConfeccionarCartaoAcessoComponent, canActivate: [AuthGuardService] },
  { path: "listar-pedido-cartao-entidade", component: ListarPedidoCartaoEntidadeComponent, canActivate: [AuthGuardService] },
  { path: "detalhar-pedido-cartao-entidade", component: DetalharPedidoCartaoEntidadeComponent, canActivate: [AuthGuardService] },
  { path: "registrar-pendencia-pedido-cartao", component: RegistrarPendenciaPedidoCartaoComponent, canActivate: [AuthGuardService] },
  { path: "listar-pendencia-pedido-cartao", component: ListarPendenciaPedidoCartaoComponent, canActivate: [AuthGuardService] },
  { path: "listar-pendencia-pedido-cartao-entidade", component: ListarPendenciaPedidoCartaoEntidadeComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PedidoCartaoRoutingModule { }
