import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfessorEscolaRoutingModule } from './professor-escola-routing.module';
import { InserirProfessorEscolaComponent } from './inserir-professor-escola/inserir-professor-escola.component';
import { FormsModule } from '../forms/forms.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [InserirProfessorEscolaComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    ProfessorEscolaRoutingModule
  ]
})
export class ProfessorEscolaModule { }
