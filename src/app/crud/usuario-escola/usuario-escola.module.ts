import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuarioEscolaRoutingModule } from './usuario-escola-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { InserirUsuarioEscolaComponent } from './inserir-usuario-escola/inserir-usuario-escola.component';

@NgModule({
  declarations: [InserirUsuarioEscolaComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    UsuarioEscolaRoutingModule
  ]
})
export class UsuarioEscolaModule { }
