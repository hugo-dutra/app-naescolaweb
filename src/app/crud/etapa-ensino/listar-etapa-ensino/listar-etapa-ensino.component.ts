import { Component, OnInit } from '@angular/core';
import { EtapaEnsinoService } from '../etapa-ensino.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { EtapaEnsino } from '../etapa-ensino.model';
import { Router, NavigationExtras } from '@angular/router';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-listar-etapa-ensino',
  templateUrl: './listar-etapa-ensino.component.html',
  styleUrls: ['./listar-etapa-ensino.component.scss'],
  providers: [EtapaEnsinoService],
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
export class ListarEtapaEnsinoComponent implements OnInit {

  public etapasEnsino: Array<Object>;
  public etapaEnsino = new EtapaEnsino();
  public estado: string = "visivel";
  public feedbackUsuario: string;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirComponenteAlterar: Boolean = false;
  public exibirComponenteInserir: Boolean = false;
  public exibirComponenteExcluir: Boolean = false;
  public decrescente: boolean = true;

  constructor(
    private etapaEnsinoService: EtapaEnsinoService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router
  ) { }

  ngOnInit() {
    this.exibirComponentesEdicao();
    this.listar();
  }

  public exibirComponentesEdicao(): void {
    this.exibirComponenteInserir = Utils.exibirComponente('inserir-etapa-ensino');
    this.exibirComponenteAlterar = Utils.exibirComponente('alterar-etapa-ensino');
    this.exibirComponenteExcluir = Utils.exibirComponente('excluir-etapa-ensino');
  }

  public listar(): void {
    this.feedbackUsuario = "Carregando dados, aguarde";
    this.etapaEnsinoService
      .listar()
      .toPromise()
      .then((response: Response) => {
        this.etapasEnsino = Object.values(response);
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

  public adicionar(): void {
    this.router.navigateByUrl(`${this.router.url}/inserir-etapa-ensino`);
  }

  public alterar(etapaEnsino: EtapaEnsino): void {
    let navigationExtras: NavigationExtras = {
      queryParams: { etapaEnsino: JSON.stringify(etapaEnsino) }
    };
    this.router.navigate([`${this.router.url}/alterar-etapa-ensino`], navigationExtras);
  }

  public excluir(etapaEnsino: EtapaEnsino): void {
    let navigationExtras: NavigationExtras = {
      queryParams: { etapaEnsino: JSON.stringify(etapaEnsino) }
    };
    this.router.navigate([`${this.router.url}/excluir-etapa-ensino`], navigationExtras);
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

  public ordenarColuna(campo: string): void {
    if (!this.decrescente) {
      let retorno = this.etapasEnsino.sort(function (a, b) {
        if (a[campo] < b[campo]) {
          return 1;
        }
        if (a[campo] > b[campo]) {
          return -1;
        }
        return 0;
      })
      this.etapasEnsino = retorno;
    } else {
      let retorno = this.etapasEnsino.sort(function (a, b) {
        if (a[campo] > b[campo]) {
          return 1;
        }
        if (a[campo] < b[campo]) {
          return -1;
        }
        return 0;
      })
      this.etapasEnsino = retorno;
    }
    this.decrescente = !this.decrescente;
  }

}
