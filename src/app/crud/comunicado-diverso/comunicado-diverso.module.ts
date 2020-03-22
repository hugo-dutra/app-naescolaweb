import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComunicadoDiversoRoutingModule } from './comunicado-diverso-routing.module';
import { InserirComunicadoDiversoComponent } from './inserir-comunicado-diverso/inserir-comunicado-diverso.component';
import { ListarComunicadoDiversoComponent } from './listar-comunicado-diverso/listar-comunicado-diverso.component';

@NgModule({
  declarations: [InserirComunicadoDiversoComponent, ListarComunicadoDiversoComponent],
  imports: [
    CommonModule,
    ComunicadoDiversoRoutingModule,
  ],
})
export class ComunicadoDiversoModule { }
