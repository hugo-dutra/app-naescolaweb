import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConselhoClasseRoutingModule } from './conselho-classe-routing.module';
import { ConselhoAnaliseEstudanteComponent } from './conselho-analise-estudante/conselho-analise-estudante.component';

@NgModule({
  declarations: [ConselhoAnaliseEstudanteComponent],
  imports: [
    CommonModule,
    ConselhoClasseRoutingModule
  ]
})
export class ConselhoClasseModule { }
