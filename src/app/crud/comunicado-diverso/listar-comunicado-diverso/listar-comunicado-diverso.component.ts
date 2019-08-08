import { Component, OnInit } from '@angular/core';
import { ComunicadoDiversoService } from '../comunicado-diverso.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';
import { AlertModalService } from '../../../shared-module/alert-modal.service';

@Component({
  selector: 'ngx-listar-comunicado-diverso',
  templateUrl: './listar-comunicado-diverso.component.html',
  styleUrls: ['./listar-comunicado-diverso.component.scss'],
  providers: [ComunicadoDiversoService],
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
export class ListarComunicadoDiversoComponent implements OnInit {

  public arrayOfComunicados = new Array<any>();
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public tableLimit: number = 10;
  public totalRegistros: number = 0;
  public offsetRegistros: number = 0;
  public saltarQuantidade: number = 10;
  public navegacaoInicio: boolean = undefined;
  public navegacaoFim: boolean = undefined;
  public valorFiltro: string = "";
  public statusFiltro: boolean = false;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;

  public data_inicio: string;
  public data_fim: string
  public status_mensagem: number;
  public dados_escola: Object;
  public esc_id: number;


  constructor(
    private comunicadoDiversoService: ComunicadoDiversoService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.arrayOfComunicados = undefined;
    this.status_mensagem = -1;
    this.dados_escola = JSON.parse(
      Utils.decriptAtoB(
        localStorage.getItem("dados_escola"),
        CONSTANTES.PASSO_CRIPT
      )
    )[0];
    this.esc_id = parseInt(this.dados_escola["id"]);
    this.inicializarDatas();
  }

  public inicializarDatas(): void {
    this.data_inicio = new Date().getFullYear().toString() + "-01-01";
    this.data_fim =
      new Date().getFullYear().toString() +
      "-" +
      ("0" + (new Date().getMonth() + 1)).slice(-2).toString() +
      "-" +
      ("0" + new Date().getDate()).slice(-2).toString();
  }

  public listarQuantidade(limit: number = 5) {
    this.navegacaoInicio = undefined;
    this.navegacaoFim = undefined;
    this.offsetRegistros = 0;
    this.saltarQuantidade = limit;
    this.filtrar(this.saltarQuantidade);
  }

  //Método de navegação otimizado. Replicar para demais listagens.
  public navegarProximo() {
    if (!this.navegacaoFim) {
      this.offsetRegistros = this.offsetRegistros + this.saltarQuantidade;
      this.filtrarNavegacao(this.saltarQuantidade, this.offsetRegistros);
    }
    this.verificaLimitesNavegacao();
  }

  //Método de navegação otimizado. Replicar para demais listagens.
  public navegarAnterior() {
    if (!this.navegacaoInicio) {
      this.offsetRegistros = this.offsetRegistros - this.saltarQuantidade;
      this.filtrarNavegacao(this.saltarQuantidade, this.offsetRegistros);
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

  public selecionarStatusMensagem(event: Event): void {
    this.status_mensagem = parseInt((<HTMLInputElement>event.target).value);
  }

  public gravarDados(event: Event) {
    let nome = (<HTMLInputElement>event.target).name;
    let valor = (<HTMLInputElement>event.target).value;
    switch (nome) {
      case "data_inicial": {
        this.data_inicio = valor;
        break;
      }
      case "data_final": {
        this.data_fim = valor;
        break;
      }
      default: {
        break;
      }
    }
  }

  public ordenarColuna(campo: string): void {
    let retorno = this.arrayOfComunicados.sort(function (a, b) {
      if (a[campo] > b[campo]) {
        return 1;
      }
      if (a[campo] < b[campo]) {
        return -1;
      }
      return 0;
    })
    this.arrayOfComunicados = retorno;
  }

  public filtrar(limit: number = 10, offset: number = 0): void {
    this.saltarQuantidade = limit;
    this.offsetRegistros = 0;
    this.feedbackUsuario = undefined;
    this.feedbackUsuario = "Carregando dados, aguarde...";
    this.comunicadoDiversoService
      .filtrar(this.status_mensagem, this.data_inicio, this.data_fim, limit, offset, this.esc_id)
      .toPromise()
      .then((response: Response) => {
        this.arrayOfComunicados = Object.values(response);
        if (this.arrayOfComunicados.length > 0) {
          this.totalRegistros = this.arrayOfComunicados[0].total;
        } else {
          this.totalRegistros = 0;
        }
        this.feedbackUsuario = undefined;
        this.verificaLimitesNavegacao();
      })
      .catch((erro: Response) => {
        this.feedbackUsuario = undefined;
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
      });
  }

  //Filtro de navegação é diferente do filtro convencional
  public filtrarNavegacao(limit: number = 10, offset: number = 0): void {
    this.saltarQuantidade = limit;
    this.feedbackUsuario = undefined;
    this.feedbackUsuario = "Carregando dados, aguarde...";
    this.comunicadoDiversoService
      .filtrar(this.status_mensagem, this.data_inicio, this.data_fim, limit, offset, this.esc_id)
      .toPromise()
      .then((response: Response) => {
        this.arrayOfComunicados = Object.values(response);
        if (this.arrayOfComunicados.length > 0) {
          this.totalRegistros = this.arrayOfComunicados[0].total;
        } else {
          this.totalRegistros = 0;
        }
        this.feedbackUsuario = undefined;
        this.verificaLimitesNavegacao();
      })
      .catch((erro: Response) => {
        this.feedbackUsuario = undefined;
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
      });
  }

  public inserir(): void {
    this.router.navigate([`${this.route.parent.routeConfig.path}/inserir-comunicado-diverso`]);
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }


}
