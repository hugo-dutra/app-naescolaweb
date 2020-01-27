import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-gerenciar-transferencia',
  templateUrl: './gerenciar-transferencia.component.html',
  styleUrls: ['./gerenciar-transferencia.component.scss']
})
export class GerenciarTransferenciaComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  public navegarTransferirEscola(): void {
    this.router.navigate([`${this.router.url}/transferencia-escola`]);
  }

  public navegarTransferirTurma(): void {
    this.router.navigate([`${this.router.url}/transferencia-turma`]);
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

}
