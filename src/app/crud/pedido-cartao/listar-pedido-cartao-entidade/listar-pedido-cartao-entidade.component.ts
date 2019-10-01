import { Component, OnInit } from '@angular/core';
import { PedidoCartaoService } from '../pedido-cartao.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-listar-pedido-cartao-entidade',
  templateUrl: './listar-pedido-cartao-entidade.component.html',
  styleUrls: ['./listar-pedido-cartao-entidade.component.scss'],
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
export class ListarPedidoCartaoEntidadeComponent implements OnInit {

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
  public problemasPendentes: number = 0;
  public exibirComponenteDetalhar: Boolean = false;

  constructor(
    private pedidoCartaoService: PedidoCartaoService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.exibirComponentesEdicao();
    this.esc_id = parseInt(
      Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT)
    );
    this.inicializarDatas();
    this.usr_id = parseInt(JSON.parse(Utils.decriptAtoB(localStorage.getItem("dados"), CONSTANTES.PASSO_CRIPT))[0].id);
    this.problemasPendentes = 0;
    this.contarProblemasPendentes();
  }

  public exibirComponentesEdicao(): void {
    this.exibirComponenteDetalhar = Utils.exibirComponente('detalhar-pedido-cartao-entidade');
  }


  public contarProblemasPendentes(): void {
    this.feedbackUsuario = "Carregando pendências, aguarde..."

    this.pedidoCartaoService.listarPendencia(this.data_inicio, this.data_fim, this.usr_id).toPromise().then((response: Response) => {
      let arrayOfPendencias: Array<Object> = Object.values(response);
      arrayOfPendencias.forEach((elem) => {
        if (elem["status"] == "pendente") {
          this.problemasPendentes++;
        }
      })
      this.feedbackUsuario = undefined;
    }).catch((erro: Response) => {
      this.feedbackUsuario = undefined;
      //Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      //registra log de erro no firebase usando serviço singlenton
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
      //Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
    })
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

  public listarPendencia(): void {
    this.router.navigate([`${this.route.parent.routeConfig.path}/listar-pendencia-pedido-cartao-entidade`]);
  }

  public listar(): void {
    this.feedbackUsuario = "Carregando dados, aguarde...";
    this.pedidoCartaoService
      .listarPedidoUsuarioEntidade(this.usr_id, this.data_inicio, this.data_fim)
      .toPromise()
      .then((response: Response) => {
        this.arrayOfPedidos = Object.values(response);
        this.feedbackUsuario = undefined;
      })
      .catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      });
  }

  public listarDiscreto(): void {
    this.feedbackUsuario = "Carregando pedidos atualizados, aguarde...";
    this.pedidoCartaoService
      .listarPedidoUsuarioEntidade(this.usr_id, this.data_inicio, this.data_fim)
      .toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = undefined;
        this.arrayOfPedidos = Object.values(response);
      })
      .catch((erro: Response) => {
        this.feedbackUsuario = undefined;
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
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
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
      //Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
      this.feedbackUsuario = undefined;
    })
  }

  public detalharPedido(pec_id: number): void {
    let navigationExtras: NavigationExtras = {
      queryParams: { pec_id: JSON.stringify(pec_id), rota_origem: JSON.stringify("") }
    };
    this.router.navigate([`${this.route.parent.routeConfig.path}/detalhar-pedido-cartao-entidade`], navigationExtras);
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

  public mudarStatusPedido(ped: Object, event: Event): void {
    let pedido = ped;
    let cod_status_pedido = parseInt((<HTMLInputElement>event.target).value);
    let usr_id = this.usr_id;
    this.feedbackUsuario = "Atualizando status do pedido, aguarde..."
    this.pedidoCartaoService.alterarStatusPedidoEntidade(parseInt(pedido["id"]), usr_id, cod_status_pedido).toPromise().then((response: Response) => {
      this.feedbackUsuario = undefined;
      this.listarDiscreto();
    }).catch((erro: Response) => {
      this.feedbackUsuario = undefined;
      //Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      //registra log de erro no firebase usando serviço singlenton
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
      //Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
    })
  }


}
