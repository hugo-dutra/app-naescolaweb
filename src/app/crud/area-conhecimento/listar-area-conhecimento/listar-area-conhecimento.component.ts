import { Component, OnInit } from '@angular/core';
import { AreaConhecimentoService } from '../area-conhecimento.service';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { AreaConhecimento } from '../area-conhecimento.model';
import { Router, NavigationExtras } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'ngx-listar-area-conhecimento',
  templateUrl: './listar-area-conhecimento.component.html',
  styleUrls: ['./listar-area-conhecimento.component.scss'],
  providers: [AreaConhecimentoService],
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
    ]),
  ]
})
export class ListarAreaConhecimentoComponent implements OnInit {

  public areaConhecimento = new AreaConhecimento();
  public areasConhecimento: Array<Object>;
  public estado: string = "visivel";
  public feedbackUsuario: string;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirComponenteAlterar: Boolean = false;
  public exibirComponenteInserir: Boolean = false;
  public exibirComponenteExcluir: Boolean = false;
  public decrescente: boolean = true;


  constructor(
    private areaConhecimentoService: AreaConhecimentoService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router
  ) { }
  ngOnInit() {
    this.exibirComponentesEdicao();
    this.listar();
  }

  public listar() {
    this.feedbackUsuario = "Carregando dados, aguarde...";
    this.areaConhecimentoService
      .listar()
      .toPromise()
      .then((response: Response) => {
        this.areasConhecimento = Object.values(response);
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

  public adicionar() {
    this.router.navigate([`${this.router.url}/inserir-area-conhecimento`]);
  }

  public alterar(areaConhecimento: AreaConhecimento): void {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        area: JSON.stringify(areaConhecimento)
      }
    };
    this.router.navigate([`${this.router.url}/alterar-area-conhecimento`], navigationExtras);
  }

  public excluir(area: AreaConhecimento) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        area: JSON.stringify(area)
      }
    };
    this.router.navigate([`${this.router.url}/excluir-area-conhecimento`], navigationExtras);
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

  public exibirComponentesEdicao(): void {
    this.exibirComponenteAlterar = Utils.exibirComponente('alterar-area-conhecimento');
    this.exibirComponenteExcluir = Utils.exibirComponente('excluir-area-conhecimento');
    this.exibirComponenteInserir = Utils.exibirComponente('inserir-area-conhecimento');
  }

  public ordenarColuna(campo: string): void {
    if (!this.decrescente) {
      let retorno = this.areasConhecimento.sort(function (a, b) {
        if (a[campo] < b[campo]) {
          return 1;
        }
        if (a[campo] > b[campo]) {
          return -1;
        }
        return 0;
      })
      this.areasConhecimento = retorno;

    } else {
      let retorno = this.areasConhecimento.sort(function (a, b) {
        if (a[campo] > b[campo]) {
          return 1;
        }
        if (a[campo] < b[campo]) {
          return -1;
        }
        return 0;
      })
      this.areasConhecimento = retorno;
    }
    this.decrescente = !this.decrescente;
  }

}
