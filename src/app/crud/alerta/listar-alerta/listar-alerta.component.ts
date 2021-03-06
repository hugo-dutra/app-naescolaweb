import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Utils } from '../../../shared/utils.shared';
import { AlertaService } from '../alerta.service';


@Component({
  selector: 'ngx-listar-alerta',
  templateUrl: './listar-alerta.component.html',
  styleUrls: ['./listar-alerta.component.scss'],
  providers: [AlertaService],
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
export class ListarAlertaComponent implements OnInit {
  public dados_escola = new Array<Object>();
  public dados_usuario = new Array<Object>();
  public feedbackUsuario: string;
  public estado: string = 'visivel';
  public esc_id: number;
  public usr_id: number;
  public anoAtual: number;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public arrayOfRegrasAlertas: Array<Object>;
  public exibirComponenteAlterar: Boolean = false;
  public exibirComponenteExcluir: Boolean = false;
  public decrescente: boolean = true;


  constructor(
    private alertaService: AlertaService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router,
    private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.exibirComponentesEdicao();
    this.carregarDados();
    this.listarAlertas();
  }

  public exibirComponentesEdicao(): void {
    this.exibirComponenteAlterar = Utils.exibirComponente('alterar-alerta');
    this.exibirComponenteExcluir = Utils.exibirComponente('excluir-alerta');
  }

  public excluir(regra: Object): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        regra: JSON.stringify(regra)
      },
    };
    this.router.navigate([`${this.activeRoute.parent.routeConfig.path}/excluir-alerta`], navigationExtras);
  }

  public alterar(regra: Object): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        regra: JSON.stringify(regra)
      },
    };
    this.router.navigate([`${this.activeRoute.parent.routeConfig.path}/alterar-alerta`], navigationExtras);
  }

  public carregarDados(): void {
    this.dados_escola = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados_escola'), CONSTANTES.PASSO_CRIPT))[0];
    this.dados_usuario = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados'), CONSTANTES.PASSO_CRIPT))[0];
    this.esc_id = parseInt(this.dados_escola['id'], 10);
  }

  public listarAlertas(): void {
    this.feedbackUsuario = 'Carregando alertas, aguarde...';
    this.alertaService.listarRegraAlerta(this.esc_id).toPromise().then((response: Response) => {
      this.feedbackUsuario = undefined;
      this.arrayOfRegrasAlertas = Object.values(response);
    }).catch((erro: Response) => {
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

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

  public gerenciarAlerta(): void {
    this.router.navigate(['gerenciar-alerta-ocorrencia']);
  }

  public ordenarColuna(campo: string): void {
    if (!this.decrescente) {
      const retorno = this.arrayOfRegrasAlertas.sort(function (a, b) {
        if (a[campo] < b[campo]) {
          return 1;
        }
        if (a[campo] > b[campo]) {
          return -1;
        }
        return 0;
      });
      this.arrayOfRegrasAlertas = retorno;

    } else {
      const retorno = this.arrayOfRegrasAlertas.sort(function (a, b) {
        if (a[campo] > b[campo]) {
          return 1;
        }
        if (a[campo] < b[campo]) {
          return -1;
        }
        return 0;
      });
      this.arrayOfRegrasAlertas = retorno;
    }
    this.decrescente = !this.decrescente;
  }


}
