import { Component, OnInit } from '@angular/core';
import { PedidoCartaoService } from '../pedido-cartao.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-listar-pedido-cartao',
  templateUrl: './listar-pedido-cartao.component.html',
  styleUrls: ['./listar-pedido-cartao.component.scss'],
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
export class ListarPedidoCartaoComponent implements OnInit {

  public arrayOfPedidos = new Array<Object>();
  public arrayOfDetalhesPedido = new Array<Object>();

  public data_inicio: string;
  public data_fim: string;
  public esc_id: number;
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public usr_id: number;
  public exibirComponenteCancelar: Boolean = false;
  public exibirComponenteDetalhar: Boolean = false;


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
    this.exibirComponentesEdicao();
    this.inicializarDatas();
    this.usr_id = parseInt(JSON.parse(Utils.decriptAtoB(localStorage.getItem("dados"), CONSTANTES.PASSO_CRIPT))[0].id);
  }

  public exibirComponentesEdicao(): void {
    this.exibirComponenteCancelar = Utils.exibirComponente('cancelar-pedido-cartao');
    this.exibirComponenteDetalhar = Utils.exibirComponente('detalhar-pedido-cartao');

  }

  public gerenciarCartao(): void {
    this.router.navigate(['gerenciar-pedido-cartao']);
  }

  public registrarPendencia(): void {

    this.router.navigate([`${this.route.parent.routeConfig.path}/registrar-pendencia-pedido-cartao`]);
  }

  public listarPendencia(): void {
    this.router.navigate([`${this.route.parent.routeConfig.path}/listar-pendencia-pedido-cartao`]);
  }

  public ordenarColuna(campo: string): void {
    let retorno = this.arrayOfPedidos.sort(function (a, b) {
      if (a[campo] > b[campo]) {
        return 1;
      }
      if (a[campo] < b[campo]) {
        return -1;
      }
      return 0;
    })
    this.arrayOfPedidos = retorno;
  }

  public listar(): void {
    this.feedbackUsuario = "Carregando dados, aguarde...";
    this.pedidoCartaoService
      .listarPeriodoEscId(this.data_inicio, this.data_fim, this.esc_id)
      .toPromise()
      .then((response: Response) => {
        this.arrayOfPedidos = Object.values(response);
        this.feedbackUsuario = undefined;
      })
      .catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
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

  public cancelarPedido(pedido: Object): void {
    this.feedbackUsuario = "Cancelando pedido, aguarde..."
    this.pedidoCartaoService.cancelar(pedido["id"], this.usr_id).toPromise().then((response: Response) => {
      this.feedbackUsuario = undefined;
      this.listar();
    }).catch((erro: Response) => {
      //Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      //registra log de erro no firebase usando serviço singlenton
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
      //Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
      this.feedbackUsuario = undefined;
    })
  }

  public detalharPedido(pec_id: number): void {
    let navigationExtras: NavigationExtras = {
      queryParams: { pec_id: JSON.stringify(pec_id) }
    };

    this.router.navigate([`${this.route.parent.routeConfig.path}/detalhar-pedido-cartao`], navigationExtras);
  }

  public inserir(): void {
    this.router.navigate([`${this.route.parent.routeConfig.path}/inserir-pedido-cartao`]);
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

}
