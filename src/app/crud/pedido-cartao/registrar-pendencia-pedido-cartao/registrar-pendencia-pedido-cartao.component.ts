import { Component, OnInit } from '@angular/core';
import { PedidoCartaoService } from '../pedido-cartao.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-registrar-pendencia-pedido-cartao',
  templateUrl: './registrar-pendencia-pedido-cartao.component.html',
  styleUrls: ['./registrar-pendencia-pedido-cartao.component.scss'],
  providers: [PedidoCartaoService],
  animations: [
    trigger('chamado', [
      state(
        'visivel',
        style({
          opacity: 1,
        }),
      ),
      transition('void => visivel', [
        style({ opacity: 0 }),
        animate(CONSTANTES.ANIMATION_DELAY_TIME + 'ms ease-in-out'),
      ]),
    ]),
  ],
})
export class RegistrarPendenciaPedidoCartaoComponent implements OnInit {

  private valorFiltro: string = '';
  public arrayOfPedidos = new Array<Object>();
  private detalheProblema: string = '';

  public feedbackUsuario: string;
  public estado: string = 'visivel';
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public esc_id: number;

  constructor(
    private pedidoCartaoService: PedidoCartaoService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.esc_id = parseInt(
      Utils.decriptAtoB(localStorage.getItem('esc_id'), CONSTANTES.PASSO_CRIPT), 10);
  }

  public gravarDetalheProblema(event: Event): void {
    this.detalheProblema = (<HTMLInputElement>event.target).value;
  }

  public gravarValorFiltro(event: Event): void {
    this.valorFiltro = (<HTMLInputElement>event.target).value;
  }

  public filtrarPedidoCartao(): void {
    this.feedbackUsuario = 'Carregando dados, aguarde...';
    this.pedidoCartaoService
      .filtrarPedidoNomeEstudante(this.valorFiltro, this.esc_id)
      .toPromise()
      .then((response: Response) => {
        this.arrayOfPedidos = Object.values(response);
        this.feedbackUsuario = undefined;
      })
      .catch((erro: Response) => {
        // Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        // registra log de erro no firebase usando servi??o singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`,
          JSON.stringify(erro));
        // Gravar erros no analytics
        Utils.gravarErroAnalytics(JSON.stringify(erro));
        // Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      });
  }

  public filtrarEnter(event: KeyboardEvent) {
    if (event.key == 'Enter') {
      this.filtrarPedidoCartao();
    }
  }

  public ordenarColuna(campo: string): void {
    const retorno = this.arrayOfPedidos.sort(function (a, b) {
      if (a[campo] > b[campo]) {
        return 1;
      }
      if (a[campo] < b[campo]) {
        return -1;
      }
      return 0;
    });
    this.arrayOfPedidos = retorno;
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

  public listarPedidos(): void {
    this.router.navigate([`${this.route.parent.routeConfig.path}/listar-pedido-cartao`]);
  }

  public registrarPendencia(pedido: Object): void {
    this.feedbackUsuario = 'Salvando registro de problema, aguarde...';
    this.pedidoCartaoService
      .inserirPendencia(
        this.detalheProblema,
        pedido['est_id'],
        pedido['usr_id'],
        pedido['pec_id'],
      )
      .toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = undefined;
      })
      .catch((erro: Response) => {
        // Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        // registra log de erro no firebase usando servi??o singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`,
          JSON.stringify(erro));
        // Gravar erros no analytics
        Utils.gravarErroAnalytics(JSON.stringify(erro));
        // Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      });
  }
}
