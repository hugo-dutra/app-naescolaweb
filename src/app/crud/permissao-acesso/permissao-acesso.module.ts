import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PermissaoAcessoRoutingModule } from './permissao-acesso-routing.module';
import { ListarPermissaoAcessoComponent } from './listar-permissao-acesso/listar-permissao-acesso.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [ListarPermissaoAcessoComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    PermissaoAcessoRoutingModule
  ]
})
export class PermissaoAcessoModule { }
