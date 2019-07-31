import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PeriodoLetivoRoutingModule } from './periodo-letivo-routing.module';
import { AlterarPeriodoLetivoComponent } from './alterar-periodo-letivo/alterar-periodo-letivo.component';
import { ExcluirPeriodoLetivoComponent } from './excluir-periodo-letivo/excluir-periodo-letivo.component';
import { InserirPeriodoLetivoComponent } from './inserir-periodo-letivo/inserir-periodo-letivo.component';
import { ListarPeriodoLetivoComponent } from './listar-periodo-letivo/listar-periodo-letivo.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AlterarPeriodoLetivoComponent, ExcluirPeriodoLetivoComponent, InserirPeriodoLetivoComponent, ListarPeriodoLetivoComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    PeriodoLetivoRoutingModule
  ]
})
export class PeriodoLetivoModule { }
