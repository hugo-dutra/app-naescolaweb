import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerfilRoutingModule } from './perfil-routing.module';
import { AlterarPerfilComponent } from './alterar-perfil/alterar-perfil.component';
import { ExcluirPerfilComponent } from './excluir-perfil/excluir-perfil.component';
import { InserirPerfilComponent } from './inserir-perfil/inserir-perfil.component';
import { ListarPerfilComponent } from './listar-perfil/listar-perfil.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AlterarPerfilComponent,
    ExcluirPerfilComponent,
    InserirPerfilComponent,
    ListarPerfilComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PerfilRoutingModule
  ]
})
export class PerfilModule { }
