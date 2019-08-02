import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RedeEnsinoRoutingModule } from './rede-ensino-routing.module';
import { InserirRedeEnsinoComponent } from './inserir-rede-ensino/inserir-rede-ensino.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [InserirRedeEnsinoComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RedeEnsinoRoutingModule
  ]
})
export class RedeEnsinoModule { }
