import { Component, OnInit } from '@angular/core';
import { TurmaService } from '../turma.service';
import { EscolaService } from '../../escola/escola.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router, NavigationExtras } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';
import { Turma } from '../turma.model';

@Component({
  selector: 'ngx-listar-turma',
  templateUrl: './listar-turma.component.html',
  styleUrls: ['./listar-turma.component.scss'],
  providers: [TurmaService, EscolaService],
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
export class ListarTurmaComponent implements OnInit {

  public turmas = new Array<Object>();
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public tableLimit: number = 5;
  public totalRegistros: number;
  public offsetRegistros: number = 0;
  public saltarQuantidade: number = 5;
  public navegacaoInicio: boolean = undefined;
  public navegacaoFim: boolean = undefined;
  public valorFiltro: string = "";
  public statusFiltro: boolean = false;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirComponenteAlterar: Boolean = false;
  public exibirComponenteInserir: Boolean = false;
  public exibirComponenteExcluir: Boolean = false;
  public decrescente: boolean = true;


  constructor(
    private turmaService: TurmaService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private escolaService: EscolaService,
    private router: Router
  ) { }

  ngOnInit() {
    this.turmas = undefined;
    this.exibirComponentesEdicao();
    this.listar(this.saltarQuantidade);
  }

  public exibirComponentesEdicao(): void {
    this.exibirComponenteInserir = Utils.exibirComponente('inserir-turma');
    this.exibirComponenteAlterar = Utils.exibirComponente('alterar-turma');
    this.exibirComponenteExcluir = Utils.exibirComponente('excluir-turma');
  }

  public listarQuantidade(event: Event) {
    this.navegacaoInicio = undefined;
    this.navegacaoFim = undefined;
    this.offsetRegistros = 0;
    this.saltarQuantidade = parseInt((<HTMLInputElement>event.target).value);
    if (this.statusFiltro) {
      this.filtrar(this.saltarQuantidade);
    } else {
      this.listar(this.saltarQuantidade);
    }
  }

  public listarEstudantes(trm_id: number, serie: string, turma: string, turno: string): void {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        trm_id: JSON.stringify(trm_id),
        serie: JSON.stringify(serie),
        turma: JSON.stringify(turma),
        turno: JSON.stringify(turno)
      }
    }
    this.router.navigate([`${this.router.url}/listar-estudantes-turma-id`], navigationExtras)
  }

  public listar(limit: number = 5, offset: number = 0): void {
    let esc_id: number = parseInt(
      Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT)
    );

    this.saltarQuantidade = limit;
    this.feedbackUsuario = undefined;
    this.feedbackUsuario = "Carregando dados, aguarde...";
    this.turmaService
      .listar(limit, offset, true, esc_id)
      .toPromise()
      .then((response: Response) => {
        this.turmas = Object.values(response);
        if (this.turmas.length > 0) {
          this.totalRegistros = parseInt(this.turmas[0]["total"]);
        } else {
          this.totalRegistros = 0;
        }
        this.feedbackUsuario = undefined;
        this.verificaLimitesNavegacao();
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

  public listarTodas(): void {
    this.feedbackUsuario = "Carregando dados, aguarde...";
    this.turmaService
      .listarTodas()
      .toPromise()
      .then((response: Response) => {
        this.turmas = Object.values(response);
        if (this.turmas.length > 0) {
          this.totalRegistros = parseInt(this.turmas[0]["total"]);
        } else {
          this.totalRegistros = 0;
        }
        this.feedbackUsuario = undefined;
        this.verificaLimitesNavegacao();
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

  public alterar(turma: Turma): void {
    let navigationExtras: NavigationExtras = {
      queryParams: { turma: JSON.stringify(turma) }
    };
    this.router.navigate([`${this.router.url}/alterar-turma`], navigationExtras);
  }

  public excluir(turma: Turma): void {
    let navigationExtras: NavigationExtras = {
      queryParams: { turma: JSON.stringify(turma) }
    };
    this.router.navigate([`${this.router.url}/excluir-turma`], navigationExtras);
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
      let retorno = this.turmas.sort(function (a, b) {
        if (a[campo] < b[campo]) {
          return 1;
        }
        if (a[campo] > b[campo]) {
          return -1;
        }
        return 0;
      })
      this.turmas = retorno;
    } else {
      let retorno = this.turmas.sort(function (a, b) {
        if (a[campo] > b[campo]) {
          return 1;
        }
        if (a[campo] < b[campo]) {
          return -1;
        }
        return 0;
      })
      this.turmas = retorno;
    }
    this.decrescente = !this.decrescente;
  }

  public filtrar(limit: number = 5, offset: number = 0): void {
    if (this.statusFiltro) {
      this.saltarQuantidade = limit;
      this.feedbackUsuario = undefined;
      this.offsetRegistros = 0;
      this.feedbackUsuario = "Carregando dados, aguarde...";
      let esc_id: number = parseInt(
        Utils.decriptAtoB(
          localStorage.getItem("esc_id"),
          CONSTANTES.PASSO_CRIPT
        )
      );
      this.turmaService
        .filtrar(this.valorFiltro, limit, offset, esc_id)
        .toPromise()
        .then((response: Response) => {
          this.turmas = Object.values(response);
          if (this.turmas.length > 0) {
            this.totalRegistros = parseInt(this.turmas[0]["total"]);
          } else {
            this.totalRegistros = 0;
          }
          this.feedbackUsuario = undefined;
          this.verificaLimitesNavegacao();
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
      this.turmaService
        .filtrar(this.valorFiltro, limit, offset, esc_id)
        .toPromise()
        .then((response: Response) => {
          this.turmas = Object.values(response);
          if (this.turmas.length > 0) {
            this.totalRegistros = parseInt(this.turmas[0]["total"]);
          } else {
            this.totalRegistros = 0;
          }
          this.feedbackUsuario = undefined;
          this.verificaLimitesNavegacao();
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
    } else {
      this.listar(limit, offset);
    }
  }

  public inserir(): void {
    this.router.navigate([`${this.router.url}/inserir-turma`]);
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

}
