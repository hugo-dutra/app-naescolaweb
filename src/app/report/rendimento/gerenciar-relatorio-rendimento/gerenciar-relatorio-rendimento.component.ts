import { Component, OnInit } from '@angular/core';
import { Utils } from '../../../shared/utils.shared';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ngx-gerenciar-relatorio-rendimento',
  templateUrl: './gerenciar-relatorio-rendimento.component.html',
  styleUrls: ['./gerenciar-relatorio-rendimento.component.scss']
})
export class GerenciarRelatorioRendimentoComponent implements OnInit {

  constructor(public router: Router, public route: ActivatedRoute) { }

  ngOnInit() {
  }

  public relatorioEstudante(): void {
    this.router.navigate([`${this.route.parent.routeConfig.path}/grafico-resumo-periodo-letivo`]);
  }

  public RelatorioDisciplina(): void {
    this.router.navigate([`${this.route.parent.routeConfig.path}/grafico-aproveitamento-professor-disciplina-periodo-letivo`]);
  }

  public RelatorioTurma(): void {
    this.router.navigate([`${this.route.parent.routeConfig.path}/grafico-aproveitamento-disciplina-turma-periodo-letivo`]);
  }

  public listagemEstudanteDestaque(): void {
    this.router.navigate([`${this.route.parent.routeConfig.path}/listar-estudante-destaque`]);
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

}
