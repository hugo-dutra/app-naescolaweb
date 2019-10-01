import { Component, OnInit } from '@angular/core';
import { PedidoCartaoService } from '../pedido-cartao.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-listar-pendencia-pedido-cartao',
  templateUrl: './listar-pendencia-pedido-cartao.component.html',
  styleUrls: ['./listar-pendencia-pedido-cartao.component.scss'],
  providers: [PedidoCartaoService],
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
export class ListarPendenciaPedidoCartaoComponent implements OnInit {

  public arrayOfPendencias = new Array<Object>();
  public data_inicio: string;
  public data_fim: string;
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public esc_id: number;
  public usr_id: number;
  constructor(
    private pedidoCartaoService: PedidoCartaoService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.esc_id = parseInt(
      Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT)
    );
    this.usr_id = parseInt(
      JSON.parse(
        Utils.decriptAtoB(localStorage.getItem("dados"), CONSTANTES.PASSO_CRIPT)
      )[0].id
    );
    this.inicializarDatas();
  }

  public listar(): void {
    this.feedbackUsuario = "Carregando problemas, aguarde...";
    this.pedidoCartaoService
      .listarPendencia(this.data_inicio, this.data_fim, this.usr_id)
      .toPromise()
      .then((response: Response) => {
        this.arrayOfPendencias = Object.values(response);
        this.feedbackUsuario = undefined;
      })
      .catch((erro: Response) => {
        this.feedbackUsuario = undefined;
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
    //Gravar erros no analytics
    Utils.gravarErroAnalytics(JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
      });
  }

  public inicializarDatas() {
    this.data_inicio = new Date().getFullYear().toString() + "-01-01";
    this.data_fim =
      new Date().getFullYear().toString() +
      "-" +
      ("0" + (new Date().getMonth() + 1)).slice(-2).toString() +
      "-" +
      ("0" + new Date().getDate()).slice(-2).toString();
  }

  public listarPedidos(): void {
    this.router.navigate([`${this.route.parent.routeConfig.path}/listar-pedido-cartao`]);
  }

  public gravarData(event: Event): void {
    let name = (<HTMLInputElement>event.target).name;
    let valor = (<HTMLInputElement>event.target).value;
    switch (name) {
      case "data_inicio": {
        this.data_inicio = valor;
        break;
      }
      case "data_fim": {
        this.data_fim = valor;
        break;
      }
      default: {
        break;
      }
    }
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

  public ordenarColuna(campo: string): void {
    let retorno = this.arrayOfPendencias.sort(function (a, b) {
      if (a[campo] > b[campo]) {
        return 1;
      }
      if (a[campo] < b[campo]) {
        return -1;
      }
      return 0;
    });
    this.arrayOfPendencias = retorno;
  }

}
