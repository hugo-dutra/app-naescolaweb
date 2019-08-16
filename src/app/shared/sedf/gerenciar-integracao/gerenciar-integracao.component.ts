import { Component, OnInit } from '@angular/core';
import { Utils } from '../../utils.shared';

@Component({
  selector: 'ngx-gerenciar-integracao',
  templateUrl: './gerenciar-integracao.component.html',
  styleUrls: ['./gerenciar-integracao.component.scss']
})
export class GerenciarIntegracaoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  public sincronizarEstudantes(): void {
    alert("Estudantes serão sincronizados por aqui");
  }
  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

}
