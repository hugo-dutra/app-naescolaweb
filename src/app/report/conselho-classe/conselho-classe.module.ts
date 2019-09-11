import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConselhoClasseRoutingModule } from './conselho-classe-routing.module';
import { ConselhoAnaliseEstudanteComponent } from './conselho-analise-estudante/conselho-analise-estudante.component';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [ConselhoAnaliseEstudanteComponent],
  imports: [
    CommonModule,
    ConselhoClasseRoutingModule,
<<<<<<< HEAD
    NgbPopoverModule
=======
    NgbPopoverModule,
>>>>>>> ajuste_carga_estudantes_aplicativo
  ]
})
export class ConselhoClasseModule { }
