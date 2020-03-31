import { NbCardModule } from '@nebular/theme';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuarioRoutingModule } from './usuario-routing.module';
import { AlterarSenhaUsuarioComponent } from './alterar-senha-usuario/alterar-senha-usuario.component';
import { AlterarUsuarioComponent } from './alterar-usuario/alterar-usuario.component';
import { ExcluirUsuarioComponent } from './excluir-usuario/excluir-usuario.component';
import { GerenciarUsuarioComponent } from './gerenciar-usuario/gerenciar-usuario.component';
import { InserirUsuarioComponent } from './inserir-usuario/inserir-usuario.component';
import { ListarUsuarioComponent } from './listar-usuario/listar-usuario.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SugestaoUsuarioComponent } from './sugestao-usuario/sugestao-usuario.component';
import { ListarSugestaoUsuarioComponent } from './listar-sugestao-usuario/listar-sugestao-usuario.component';
import { NgbModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AlterarSenhaUsuarioComponent,
    AlterarUsuarioComponent,
    ExcluirUsuarioComponent,
    GerenciarUsuarioComponent,
    InserirUsuarioComponent,
    ListarUsuarioComponent,
    SugestaoUsuarioComponent,
    ListarSugestaoUsuarioComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    UsuarioRoutingModule,
    NbCardModule,
    NgbModule,
    NgbPopoverModule,
  ],
})
export class UsuarioModule { }
