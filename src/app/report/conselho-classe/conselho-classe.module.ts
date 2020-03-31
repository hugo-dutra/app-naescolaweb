import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConselhoClasseRoutingModule } from './conselho-classe-routing.module';
import { ConselhoAnaliseEstudanteComponent } from './conselho-analise-estudante/conselho-analise-estudante.component';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { HintModule } from 'angular-custom-tour';

@NgModule({
  declarations: [ConselhoAnaliseEstudanteComponent],
  imports: [
    CommonModule,
    ConselhoClasseRoutingModule,
    NgbPopoverModule,
    HintModule,
  ],
})
export class ConselhoClasseModule { }
