import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrequenciaRoutingModule } from './frequencia-routing.module';
import { FrequenciaPortariaPeriodoComponent } from './frequencia-portaria-periodo/frequencia-portaria-periodo.component';

@NgModule({
  declarations: [FrequenciaPortariaPeriodoComponent],
  imports: [
    CommonModule,
    FrequenciaRoutingModule
  ]
})
export class FrequenciaModule { }
