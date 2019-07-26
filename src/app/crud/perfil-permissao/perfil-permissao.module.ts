import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerfilPermissaoRoutingModule } from './perfil-permissao-routing.module';
import { InserirPerfilPermissaoComponent } from './inserir-perfil-permissao/inserir-perfil-permissao.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [InserirPerfilPermissaoComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    PerfilPermissaoRoutingModule
  ]
})
export class PerfilPermissaoModule { }
