import { Component, OnInit } from '@angular/core';
import { TipoOcorrenciaDisciplinarService } from '../tipo-ocorrencia-disciplinar.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Router, NavigationExtras } from '@angular/router';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { Utils } from '../../../shared/utils.shared';
import { TipoOcorrenciaDisciplinar } from '../tipo-ocorrencia-disciplinar.model';

@Component({
  selector: 'ngx-listar-tipo-ocorrencia-disciplinar',
  templateUrl: './listar-tipo-ocorrencia-disciplinar.component.html',
  styleUrls: ['./listar-tipo-ocorrencia-disciplinar.component.scss'],
  providers: [TipoOcorrenciaDisciplinarService],
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
export class ListarTipoOcorrenciaDisciplinarComponent implements OnInit {

  constructor(
    private tipoOcorrenciaDisciplinarService: TipoOcorrenciaDisciplinarService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router
  ) { }

  public tiposOcorrenciasDisciplinares = new Array<Object>();
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public tableLimit: number = 10;
  public totalRegistros: number;
  public offsetRegistros: number = 0;
  public saltarQuantidade: number = 5;
  public navegacaoInicio: boolean = undefined;
  public navegacaoFim: boolean = undefined;
  public valorFiltro: string = "";
  public statusFiltro: boolean = false;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public esc_id: number;

  ngOnInit() {
    this.tiposOcorrenciasDisciplinares = undefined;
    this.esc_id = parseInt(Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT));
    this.listar();
  }

  public listarQuantidade(event: Event) {
    this.navegacaoInicio = undefined;
    this.navegacaoFim = undefined;
    this.offsetRegistros = 0;
    this.saltarQuantidade = parseInt((<HTMLInputElement>event.target).value);
    this.listar(this.saltarQuantidade);
  }

  public ordenarColuna(campo: string): void {
    let retorno = this.tiposOcorrenciasDisciplinares.sort(function (a, b) {
      if (a[campo] > b[campo]) {
        return 1;
      }
      if (a[campo] < b[campo]) {
        return -1;
      }
      return 0;
    })
    this.tiposOcorrenciasDisciplinares = retorno;
  }

  public listar(limit: number = 5, offset: number = 0): void {
    this.saltarQuantidade = limit;
    this.feedbackUsuario = undefined;
    this.offsetRegistros = 0;
    this.feedbackUsuario = "Carregando dados, aguarde...";
    this.tipoOcorrenciaDisciplinarService
      .listar(limit, offset, false, this.esc_id)
      .toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = undefined;
        this.tiposOcorrenciasDisciplinares = Object.values(response);
        if (this.tiposOcorrenciasDisciplinares.length > 0) {
          this.totalRegistros = this.tiposOcorrenciasDisciplinares[0]["total"];
        } else {
          this.totalRegistros = 0;
        }
        this.verificaLimitesNavegacao();
      })
      .catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro.json()["message"]);
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      });
  }

  public listarNavegacao(limit: number = 5, offset: number = 0): void {
    this.saltarQuantidade = limit;
    this.feedbackUsuario = undefined;
    this.feedbackUsuario = "Carregando dados, aguarde...";
    this.tipoOcorrenciaDisciplinarService
      .listar(limit, offset, false, this.esc_id)
      .toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = undefined;
        this.tiposOcorrenciasDisciplinares = Object.values(response);
        if (this.tiposOcorrenciasDisciplinares.length > 0) {
          this.totalRegistros = this.tiposOcorrenciasDisciplinares[0]["total"];
        } else {
          this.totalRegistros = 0;
        }
        this.verificaLimitesNavegacao();
      })
      .catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro.json()["message"]);
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      });
  }

  public alterar(tipoOcorrenciaDisciplinar: TipoOcorrenciaDisciplinar): void {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        tipoOcorrenciaDisciplinar: JSON.stringify(tipoOcorrenciaDisciplinar)
      }
    };
    this.router.navigate([`${this.router.url}/alterar-tipo-ocorrencia-disciplinar`], navigationExtras);
  }

  public excluir(tipoOcorrenciaDisciplinar: TipoOcorrenciaDisciplinar): void {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        tipoOcorrenciaDisciplinar: JSON.stringify(tipoOcorrenciaDisciplinar)
      }
    };
    this.router.navigate([`${this.router.url}/excluir-tipo-ocorrencia-disciplinar`], navigationExtras);
  }

  public navegarProximo() {
    if (!this.navegacaoFim) {
      this.offsetRegistros = this.offsetRegistros + this.saltarQuantidade;
      this.listarNavegacao(this.saltarQuantidade, this.offsetRegistros);
    }
    this.verificaLimitesNavegacao();
  }

  public navegarAnterior() {
    if (!this.navegacaoInicio) {
      this.offsetRegistros = this.offsetRegistros - this.saltarQuantidade;
      this.listarNavegacao(this.saltarQuantidade, this.offsetRegistros);
    }
    this.verificaLimitesNavegacao();
  }

  public verificaLimitesNavegacao(): void {
    //Verifica se deve desabilitar botao de registro Anterior.
    if (this.offsetRegistros + this.saltarQuantidade <= this.saltarQuantidade) {
      this.navegacaoInicio = true;
      this.navegacaoFim = false;
    } else {
      this.navegacaoInicio = false;
    }
    //Verifica se deve desabilitar botao de registro seguinte.
    if (this.offsetRegistros + this.saltarQuantidade >= this.totalRegistros) {
      this.navegacaoFim = true;
      this.navegacaoInicio = false;
    }
    else {
      this.navegacaoFim = false;
    }
    //Quantidade de registros é inferior ao tamanho do saltarQuantidade
    if (this.totalRegistros <= this.saltarQuantidade) {
      this.navegacaoInicio = true;
      this.navegacaoFim = true;
    }
  }

  public inserir(): void {
    this.router.navigate([`${this.router.url}/inserir-tipo-ocorrencia-disciplinar`]);
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

}
