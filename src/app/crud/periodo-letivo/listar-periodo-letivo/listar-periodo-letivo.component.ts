import { Component, OnInit } from '@angular/core';
import { PeriodoLetivoService } from '../periodo-letivo.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Utils } from '../../../shared/utils.shared';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { PeriodoLetivo } from '../periodo-letivo.model';

@Component({
  selector: 'ngx-listar-periodo-letivo',
  templateUrl: './listar-periodo-letivo.component.html',
  styleUrls: ['./listar-periodo-letivo.component.scss'],
  providers: [PeriodoLetivoService],
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
export class ListarPeriodoLetivoComponent implements OnInit {

  constructor(
    private periodoLetivoService: PeriodoLetivoService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  public periodosLetivos: Array<Object>;
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirComponenteAlterar: Boolean = false;
  public exibirComponenteInserir: Boolean = false;
  public exibirComponenteExcluir: Boolean = false;
  public decrescente: boolean = true;

  ngOnInit() {
    this.exibirComponentesEdicao();
    this.listar();
  }

  public exibirComponentesEdicao(): void {
    this.exibirComponenteInserir = Utils.exibirComponente('inserir-periodo-letivo');
    this.exibirComponenteAlterar = Utils.exibirComponente('alterar-periodo-letivo');
    this.exibirComponenteExcluir = Utils.exibirComponente('excluir-periodo-letivo');
  }

  public listar(): void {
    this.feedbackUsuario = "Carregando dados, aguarde...";
    this.periodoLetivoService
      .listar()
      .toPromise()
      .then((response: Response) => {
        this.periodosLetivos = Object.values(response);
        this.feedbackUsuario = undefined;
      })
      .catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
    //Gravar erros no analytics
    Utils.gravarErroAnalytics(JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      });
  }

  public alterar(periodoLetivo: PeriodoLetivo): void {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: periodoLetivo.id,
        periodo: periodoLetivo.periodo,
        inicio: periodoLetivo.inicio,
        fim: periodoLetivo.fim
      }
    };

    this.router.navigate([`${this.route.parent.routeConfig.path}/alterar-periodo-letivo`], navigationExtras);
  }

  public excluir(periodoLetivo: PeriodoLetivo) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: periodoLetivo.id,
        periodo: periodoLetivo.periodo,
        inicio: periodoLetivo.inicio,
        fim: periodoLetivo.fim
      }
    };
    this.router.navigate([`${this.route.parent.routeConfig.path}/excluir-periodo-letivo`], navigationExtras);
  }

  public adicionar(): void {
    this.router.navigate([`${this.route.parent.routeConfig.path}/inserir-periodo-letivo`]);
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

  public ordenarColuna(campo: string): void {
    if (!this.decrescente) {
      let retorno = this.periodosLetivos.sort(function (a, b) {
        if (a[campo] < b[campo]) {
          return 1;
        }
        if (a[campo] > b[campo]) {
          return -1;
        }
        return 0;
      })
      this.periodosLetivos = retorno;

    } else {
      let retorno = this.periodosLetivos.sort(function (a, b) {
        if (a[campo] > b[campo]) {
          return 1;
        }
        if (a[campo] < b[campo]) {
          return -1;
        }
        return 0;
      })
      this.periodosLetivos = retorno;
    }
    this.decrescente = !this.decrescente;
  }

}
