import { Component, OnInit } from '@angular/core';

import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router, NavigationExtras } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';
import { AlertaService } from '../alerta.service';

@Component({
  selector: 'ngx-listar-alerta',
  templateUrl: './listar-alerta.component.html',
  styleUrls: ['./listar-alerta.component.scss'],
  providers: [AlertaService],
  animations: [
    trigger("chamado", [
      state(
        "visivel",
        style({
          opacity: 1
        })
      ),
      transition("void => visivel", [
        style({ opacity: 0 }),
        animate(CONSTANTES.ANIMATION_DELAY_TIME + "ms ease-in-out")
      ])
    ])
  ]
})
export class ListarAlertaComponent implements OnInit {
  public dados_escola = new Array<Object>();
  public dados_usuario = new Array<Object>();
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public esc_id: number;
  public usr_id: number;
  public anoAtual: number;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public arrayOfRegrasAlertas: Array<Object>;

  constructor(
    private alertaService: AlertaService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router) { }

  ngOnInit() {
    this.carregarDados();
    this.listarAlertas();
  }

  public excluir(regra: Object): void {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        data_criacao: regra["data_criacao"],
        data_fim: regra["data_fim"],
        data_inicio: regra["data_inicio"],
        esc_id: regra["esc_id"],
        escola: regra["escola"],
        opa_id: regra["opa_id"],
        operador: regra["operador"],
        ral_id: regra["ral_id"],
        tipo_ocorrencia: regra["tipo_ocorrencia"],
        tod_id: regra["tod_id"],
        usr_id: regra["usr_id"],
        usuario: regra["usuario"],
        valor_referencia: regra["valor_referencia"]
      }
    }
    this.router.navigate(["excluir-alerta"], navigationExtras);
  }

  public alterar(regra: Object): void {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        data_criacao: regra["data_criacao"],
        data_fim: regra["data_fim"],
        data_inicio: regra["data_inicio"],
        esc_id: regra["esc_id"],
        escola: regra["escola"],
        opa_id: regra["opa_id"],
        operador: regra["operador"],
        ral_id: regra["ral_id"],
        tipo_ocorrencia: regra["tipo_ocorrencia"],
        tod_id: regra["tod_id"],
        usr_id: regra["usr_id"],
        usuario: regra["usuario"],
        valor_referencia: regra["valor_referencia"]
      }
    }
    this.router.navigate(["alterar-alerta"], navigationExtras);
  }

  public carregarDados(): void {
    this.dados_escola = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados_escola'), CONSTANTES.PASSO_CRIPT))[0];
    this.dados_usuario = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados'), CONSTANTES.PASSO_CRIPT))[0];
    this.esc_id = parseInt(this.dados_escola['id']);
  }

  public listarAlertas(): void {
    this.feedbackUsuario = "Carregando alertas, aguarde...";
    this.alertaService.listarRegraAlerta(this.esc_id).toPromise().then((response: Response) => {
      this.feedbackUsuario = undefined;
      this.arrayOfRegrasAlertas = Object.values(response);
    }).catch((erro: Response) => {
      //Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      //registra log de erro no firebase usando serviço singlenton
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro.json()["message"]);
      //Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
      this.feedbackUsuario = undefined;
    })
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

  public gerenciarAlerta(): void {
    this.router.navigate(['gerenciar-alerta-ocorrencia'])
  }
}
