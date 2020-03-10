import { Component, OnInit } from '@angular/core';
import { PedidoCartaoService } from '../pedido-cartao.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Utils } from '../../../shared/utils.shared';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';

@Component({
  selector: 'ngx-detalhar-pedido-cartao',
  templateUrl: './detalhar-pedido-cartao.component.html',
  styleUrls: ['./detalhar-pedido-cartao.component.scss'],
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
export class DetalharPedidoCartaoComponent implements OnInit {

  public pec_id: number;
  public arrayOfDetalhesPedido = new Array<Object>();
  public feedbackUsuario: string;
  public estado: string = 'visivel';
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;

  constructor(
    private route: ActivatedRoute,
    private pedidoCartaoService: PedidoCartaoService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router,

  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((pec_id: any) => {
      this.pec_id = JSON.parse(pec_id['pec_id']);
    });
    this.detalharPedido();
  }

  public detalharPedido(): void {
    this.feedbackUsuario = 'Carregando detalhes, aguarde...';
    this.pedidoCartaoService
      .detalharPecId(this.pec_id)
      .toPromise()
      .then((response: Response) => {
        this.arrayOfDetalhesPedido = Object.values(response);
        this.feedbackUsuario = undefined;
      })
      .catch((erro: Response) => {
        // Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        // registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`,
          JSON.stringify(erro));
        // Gravar erros no analytics
        Utils.gravarErroAnalytics(JSON.stringify(erro));
        // Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });

        this.feedbackUsuario = undefined;
      });
  }

  public listarPedidoCartao(): void {
    this.router.navigate([`${this.route.parent.routeConfig.path}/listar-pedido-cartao`]);
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

}
