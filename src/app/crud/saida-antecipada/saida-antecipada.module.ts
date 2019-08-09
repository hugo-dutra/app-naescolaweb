import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SaidaAntecipadaRoutingModule } from './saida-antecipada-routing.module';
import { ExcluirSaidaAntecipadaComponent } from './excluir-saida-antecipada/excluir-saida-antecipada.component';
import { FiltrarSaidaAntecipadaComponent } from './filtrar-saida-antecipada/filtrar-saida-antecipada.component';
import { InserirSaidaAntecipadaComponent } from './inserir-saida-antecipada/inserir-saida-antecipada.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [ExcluirSaidaAntecipadaComponent, FiltrarSaidaAntecipadaComponent, InserirSaidaAntecipadaComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    SaidaAntecipadaRoutingModule
  ]
})
export class SaidaAntecipadaModule { }
