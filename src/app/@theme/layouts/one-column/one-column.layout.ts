import { AcessoComumService } from './../../../shared/acesso-comum/acesso-comum.service';
import { Component, OnInit } from '@angular/core';
import { AccessService } from '../../../access/access.service';
import { Router } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';
import { CONSTANTES } from '../../../shared/constantes.shared';

@Component({
  selector: 'ngx-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  templateUrl: './one-column.layout.html',
  providers: [AccessService]
})
export class OneColumnLayoutComponent implements OnInit {

  public exibirLogin: boolean;
  public dados_escola = new Array<Object>();
  public esc_id: number;

  constructor(private accessService: AccessService, private router: Router, private acessoComumService: AcessoComumService, ) { }

  ngOnInit() {
    this.assinarEventoLogout();
    this.carregarDados();
    this.listarPermissoes();
  }

  public assinarEventoLogout(): void {
    this.acessoComumService.emitirAlertaLogout.subscribe((retorno: boolean) => {
      this.exibirLogin = retorno;
    })
  }


  public carregarDados(): void {
    const dados_escola = localStorage.getItem('dados_escola');
    if (dados_escola != undefined && dados_escola != null && dados_escola != "") {
      this.dados_escola = JSON.parse(Utils.decriptAtoB(dados_escola, CONSTANTES.PASSO_CRIPT))[0];
      this.esc_id = parseInt(this.dados_escola['id']);
    }
  }

  public listarPermissoes(): void {
    this.accessService
      .listarPermissoes(this.esc_id)
      .toPromise()
      .then((response: Response) => {
        let erro: string = response["error"];
        if (erro == "token_not_provided") {
          this.exibirLogin = true;
          this.router.navigate(["logar"]);
          localStorage.setItem("token", "null");
        } else {
          this.exibirLogin = false;
        }
      })
      .catch((response: Response) => {
        this.exibirLogin = true;
        this.router.navigate(["logar"]);
        localStorage.setItem("token", "null");
      });
  }
}
