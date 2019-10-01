import { Component, OnInit } from '@angular/core';
import { EstudanteService } from '../estudante.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Utils } from '../../../shared/utils.shared';
import { Estudante } from '../estudante.model';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';

@Component({
  selector: 'ngx-inserir-observacao-estudante',
  templateUrl: './inserir-observacao-estudante.component.html',
  styleUrls: ['./inserir-observacao-estudante.component.scss'],
  providers: [EstudanteService],
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
export class InserirObservacaoEstudanteComponent implements OnInit {

  constructor(
    private estudanteService: EstudanteService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  public textoObservacao: string = "";
  public arrayOfObservacoes: Array<Object>;

  public estudantes = new Array<Object>();
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
  public decrescente: boolean = true;

  ngOnInit() {
    this.estudantes = undefined;
  }

  public listarQuantidade(limit: number = 5) {
    this.navegacaoInicio = undefined;
    this.navegacaoFim = undefined;

    this.offsetRegistros = 0;
    this.saltarQuantidade = limit;

    if (this.statusFiltro) {
      this.filtrar(this.saltarQuantidade);
    } else {
      this.listar(this.saltarQuantidade);
    }
  }

  public listar(limit: number = 5, offset: number = 0): void {
    this.saltarQuantidade = limit;
    this.feedbackUsuario = undefined;
    this.feedbackUsuario = "Carregando dados, aguarde...";
    let esc_id: number = parseInt(
      Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT)
    );
    this.estudanteService
      .listar(limit, offset, true, esc_id)
      .toPromise()
      .then((response: Response) => {
        this.estudantes = Object.values(response);
        if (this.estudantes.length > 0) {
          this.totalRegistros = parseInt(response[0].total);
        } else {
          this.totalRegistros = 0;
        }
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


  //Método de navegação otimizado. Replicar para demais listagens.
  public navegarProximo() {
    if (!this.navegacaoFim) {
      this.offsetRegistros = this.offsetRegistros + this.saltarQuantidade;
      if (this.statusFiltro) {
        this.filtrarNavegacao(this.saltarQuantidade, this.offsetRegistros);
      } else {
        this.listar(this.saltarQuantidade, this.offsetRegistros);
      }
    }
    this.verificaLimitesNavegacao();
  }

  //Método de navegação otimizado. Replicar para demais listagens.
  public navegarAnterior() {
    if (!this.navegacaoInicio) {
      this.offsetRegistros = this.offsetRegistros - this.saltarQuantidade;
      if (this.statusFiltro) {
        this.filtrarNavegacao(this.saltarQuantidade, this.offsetRegistros);
      } else {
        this.listar(this.saltarQuantidade, this.offsetRegistros);
      }
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

  public gravarValorFiltro(valor: string) {
    this.valorFiltro = valor;
    if (this.valorFiltro.length < 3) {
      this.statusFiltro = false;
    } else {
      this.statusFiltro = true;
    }
  }

  public filtrarEnter(event: KeyboardEvent) {
    if (event.key == "Enter") {
      this.filtrar();
    }
  }

  public ordenarColuna(campo: string): void {
    if (!this.decrescente) {
      let retorno = this.estudantes.sort(function (a, b) {
        if (a[campo] < b[campo]) {
          return 1;
        }
        if (a[campo] > b[campo]) {
          return -1;
        }
        return 0;
      })
      this.estudantes = retorno;

    } else {
      let retorno = this.estudantes.sort(function (a, b) {
        if (a[campo] > b[campo]) {
          return 1;
        }
        if (a[campo] < b[campo]) {
          return -1;
        }
        return 0;
      })
      this.estudantes = retorno;
    }
    this.decrescente = !this.decrescente;
  }

  public filtrar(limit: number = 5, offset: number = 0): void {
    if (this.statusFiltro) {
      this.saltarQuantidade = limit;
      this.offsetRegistros = 0;
      this.feedbackUsuario = undefined;
      this.feedbackUsuario = "Carregando dados, aguarde...";
      let esc_id: number = parseInt(
        Utils.decriptAtoB(
          localStorage.getItem("esc_id"),
          CONSTANTES.PASSO_CRIPT
        )
      );
      this.estudanteService
        .filtrar(this.valorFiltro, limit, offset, esc_id)
        .toPromise()
        .then((response: Response) => {
          this.estudantes = Object.values(response);
          if (this.estudantes.length > 0) {
            this.totalRegistros = parseInt(response[0].total);
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
          this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
          //Caso token seja invalido, reenvia rota para login
          Utils.tratarErro({ router: this.router, response: erro });
        });
    } else {
      this.listar(limit, offset);
    }
  }

  public filtrarNavegacao(limit: number = 5, offset: number = 0): void {
    if (this.statusFiltro) {
      this.saltarQuantidade = limit;
      this.feedbackUsuario = undefined;
      this.feedbackUsuario = "Carregando dados, aguarde...";
      let esc_id: number = parseInt(
        Utils.decriptAtoB(
          localStorage.getItem("esc_id"),
          CONSTANTES.PASSO_CRIPT
        )
      );
      this.estudanteService
        .filtrar(this.valorFiltro, limit, offset, esc_id)
        .toPromise()
        .then((response: Response) => {
          this.estudantes = Object.values(response);
          if (this.estudantes.length > 0) {
            this.totalRegistros = parseInt(response[0].total);
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
          this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
          //Caso token seja invalido, reenvia rota para login
          Utils.tratarErro({ router: this.router, response: erro });
        });
    } else {
      this.listar(limit, offset);
    }
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

  public adicionarObservacao(estudante: Estudante): void {
    let est_id: number = estudante.id;
    let usr_id: number = JSON.parse(
      Utils.decriptAtoB(localStorage.getItem("dados"), CONSTANTES.PASSO_CRIPT)
    )[0].id;
    this.feedbackUsuario = "Salvando dados, aguarde...";
    this.estudanteService
      .inserirObservacao(usr_id, est_id, this.textoObservacao)
      .toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = undefined;
        this.textoObservacao = "";
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

  public gravarObservacao(event: Event): void {
    this.textoObservacao = (<HTMLInputElement>event.target).value;
  }

  public alterarObservacao(est_id: number): void {
    let navigationExtras: NavigationExtras = {
      queryParams: { est_id: JSON.stringify(est_id) }
    }
    this.router.navigate([`${this.route.parent.routeConfig.path}/listar-observacao-estudante`], navigationExtras);
  }

}
