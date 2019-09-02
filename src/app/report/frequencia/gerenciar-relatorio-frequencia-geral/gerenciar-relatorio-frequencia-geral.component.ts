import { Component, OnInit } from '@angular/core';
import { Utils } from '../../../shared/utils.shared';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-gerenciar-relatorio-frequencia-geral',
  templateUrl: './gerenciar-relatorio-frequencia-geral.component.html',
  styleUrls: ['./gerenciar-relatorio-frequencia-geral.component.scss']
})
export class GerenciarRelatorioFrequenciaGeralComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  public graficoFrequenciaPortaria(): void {
    this.router.navigate([`${this.router.url}/grafico-frequencia-portaria-periodo`]);
  }

  public relatorioFrequenciaBoletim(): void {
    this.router.navigate([`${this.router.url}/frequencia-boletim-turma-geral`]);
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

}
