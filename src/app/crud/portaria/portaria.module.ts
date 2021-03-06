import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortariaRoutingModule } from './portaria-routing.module';
import { AlterarPortariaComponent } from './alterar-portaria/alterar-portaria.component';
import { ExcluirPortariaComponent } from './excluir-portaria/excluir-portaria.component';
import { GerenciarPortariaComponent } from './gerenciar-portaria/gerenciar-portaria.component';
import { InserirCronogramaPortariaComponent } from './inserir-cronograma-portaria/inserir-cronograma-portaria.component';
import { InserirPortariaComponent } from './inserir-portaria/inserir-portaria.component';
import { ListarPortariaComponent } from './listar-portaria/listar-portaria.component';
import { VerificarAbsenteismoPortariaComponent } from './verificar-absenteismo-portaria/verificar-absenteismo-portaria.component';
import { VerificarFrequenciaPortariaComponent } from './verificar-frequencia-portaria/verificar-frequencia-portaria.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ControlarPortariaComponent } from './controlar-portaria/controlar-portaria.component';

@NgModule({
  declarations: [
    AlterarPortariaComponent,
    ExcluirPortariaComponent,
    GerenciarPortariaComponent,
    InserirCronogramaPortariaComponent,
    InserirPortariaComponent,
    ListarPortariaComponent,
    VerificarAbsenteismoPortariaComponent,
    VerificarFrequenciaPortariaComponent,
    ControlarPortariaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    PortariaRoutingModule
  ]
})
export class PortariaModule { }
