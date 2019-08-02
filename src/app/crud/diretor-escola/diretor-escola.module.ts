import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiretorEscolaRoutingModule } from './diretor-escola-routing.module';
import { InserirDiretorEscolaComponent } from './inserir-diretor-escola/inserir-diretor-escola.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [InserirDiretorEscolaComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    DiretorEscolaRoutingModule
  ]
})
export class DiretorEscolaModule { }
