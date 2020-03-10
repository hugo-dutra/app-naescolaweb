import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AtestadoMedicoRoutingModule } from './atestado-medico-routing.module';
import { InserirAtestadoMedicoComponent } from './inserir-atestado-medico/inserir-atestado-medico.component';
import { ListarAtestadoMedicoComponent } from './listar-atestado-medico/listar-atestado-medico.component';
import { AlterarAtestadoMedicoComponent } from './alterar-atestado-medico/alterar-atestado-medico.component';
import { ExcluirAtestadoMedicoComponent } from './excluir-atestado-medico/excluir-atestado-medico.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    InserirAtestadoMedicoComponent,
    ListarAtestadoMedicoComponent,
    AlterarAtestadoMedicoComponent,
    ExcluirAtestadoMedicoComponent],
  imports: [
    CommonModule,
    AtestadoMedicoRoutingModule,
    FormsModule,
  ],
})
export class AtestadoMedicoModule { }
