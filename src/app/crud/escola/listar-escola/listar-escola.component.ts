import { Component, OnInit } from '@angular/core';
import { EscolaService } from '../escola.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';
import { Escola } from '../escola.model';

@Component({
  selector: 'ngx-listar-escola',
  templateUrl: './listar-escola.component.html',
  styleUrls: ['./listar-escola.component.scss'],
  providers: [EscolaService],
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
export class ListarEscolaComponent implements OnInit {

  constructor(
    private escolaService: EscolaService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  public escolas = new Array<Object>();
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
  public exibirComponenteAlterar: Boolean = false;
  public exibirComponenteInserir: Boolean = false;
  public exibirComponenteExcluir: Boolean = false;
  public decrescente: boolean = true;
  public escopoUsuario: string;

  ngOnInit() {
    this.escopoUsuario = Utils.pegarDadosEscopo().nome;
    this.escolas = undefined;
    this.exibirComponentesEdicao();
    this.listar();
  }

  public exibirComponentesEdicao(): void {
    this.exibirComponenteInserir = Utils.exibirComponente('inserir-escola');
    this.exibirComponenteAlterar = Utils.exibirComponente('alterar-escola');
    this.exibirComponenteExcluir = Utils.exibirComponente('excluir-escola');
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
    if (this.escopoUsuario == CONSTANTES.ESCOPO_GLOBAL) {
      this.saltarQuantidade = limit;
      this.feedbackUsuario = undefined;
      this.feedbackUsuario = "Carregando dados, aguarde...";
      this.escolaService
        .listar(limit, offset, false)
        .toPromise()
        .then((response: Response) => {
          this.escolas = Object.values(response);
          if (this.escolas.length > 0) {
            this.totalRegistros = parseInt(this.escolas[0]["total"]);
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

    if (this.escopoUsuario == CONSTANTES.ESCOPO_REGIONAL) {
      this.saltarQuantidade = limit;
      this.feedbackUsuario = undefined;
      this.feedbackUsuario = "Carregando dados, aguarde...";
      let esc_id: number = parseInt(Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT));
      this.escolaService
        .listarRegional(limit, offset, false, esc_id)
        .toPromise()
        .then((response: Response) => {
          this.escolas = Object.values(response);
          if (this.escolas.length > 0) {
            this.totalRegistros = parseInt(this.escolas[0]["total"]);
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

    if (this.escopoUsuario == CONSTANTES.ESCOPO_LOCAL) {
      this.saltarQuantidade = limit;
      this.feedbackUsuario = undefined;
      this.feedbackUsuario = "Carregando dados, aguarde...";
      let esc_id: number = parseInt(Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT));
      this.escolaService
        .listarLocal(limit, offset, false, esc_id)
        .toPromise()
        .then((response: Response) => {
          this.escolas = Object.values(response);
          if (this.escolas.length > 0) {
            this.totalRegistros = parseInt(this.escolas[0]["total"]);
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

  }

  public alterar(escola: Escola): void {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        escola: JSON.stringify(escola)
      }
    };
    this.router.navigate([`${this.route.parent.routeConfig.path}/alterar-escola`], navigationExtras);
  }

  public excluir(escola: Escola): void {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        escola: JSON.stringify(escola)
      }
    };
    this.router.navigate([`${this.route.parent.routeConfig.path}/excluir-escola`], navigationExtras);
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
      let retorno = this.escolas.sort(function (a, b) {
        if (a[campo] < b[campo]) {
          return 1;
        }
        if (a[campo] > b[campo]) {
          return -1;
        }
        return 0;
      })
      this.escolas = retorno;
    } else {
      let retorno = this.escolas.sort(function (a, b) {
        if (a[campo] > b[campo]) {
          return 1;
        }
        if (a[campo] < b[campo]) {
          return -1;
        }
        return 0;
      })
      this.escolas = retorno;
    }
    this.decrescente = !this.decrescente;
  }

  public filtrar(limit: number = 5, offset: number = 0): void {

    if (this.escopoUsuario == CONSTANTES.ESCOPO_GLOBAL) {
      if (this.statusFiltro) {
        this.saltarQuantidade = limit;
        this.offsetRegistros = 0;
        this.feedbackUsuario = undefined;
        this.feedbackUsuario = "Carregando dados, aguarde...";
        this.escolaService
          .filtrar(this.valorFiltro, limit, offset)
          .toPromise()
          .then((response: Response) => {
            this.escolas = Object.values(response);
            if (this.escolas.length > 0) {
              this.totalRegistros = parseInt(this.escolas[0]["total"]);
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

    if (this.escopoUsuario == CONSTANTES.ESCOPO_REGIONAL) {
      if (this.statusFiltro) {
        this.saltarQuantidade = limit;
        this.offsetRegistros = 0;
        this.feedbackUsuario = undefined;
        let esc_id: number = parseInt(Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT));
        this.feedbackUsuario = "Carregando dados, aguarde...";
        this.escolaService
          .filtrarRegional(this.valorFiltro, limit, offset, esc_id)
          .toPromise()
          .then((response: Response) => {
            this.escolas = Object.values(response);
            if (this.escolas.length > 0) {
              this.totalRegistros = parseInt(this.escolas[0]["total"]);
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

    if (this.escopoUsuario == CONSTANTES.ESCOPO_LOCAL) {
      if (this.statusFiltro) {
        this.saltarQuantidade = limit;
        this.feedbackUsuario = undefined;
        this.feedbackUsuario = "Carregando dados, aguarde...";
        let esc_id: number = parseInt(Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT));
        this.escolaService
          .filtrarLocal(this.valorFiltro, limit, offset, esc_id)
          .toPromise()
          .then((response: Response) => {
            this.escolas = Object.values(response);
            if (this.escolas.length > 0) {
              this.totalRegistros = parseInt(this.escolas[0]["total"]);
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
  }

  public filtrarNavegacao(limit: number = 5, offset: number = 0): void {
    if (this.escopoUsuario == CONSTANTES.ESCOPO_GLOBAL) {
      if (this.statusFiltro) {
        this.saltarQuantidade = limit;
        this.feedbackUsuario = undefined;
        this.feedbackUsuario = "Carregando dados, aguarde...";
        this.escolaService
          .filtrar(this.valorFiltro, limit, offset)
          .toPromise()
          .then((response: Response) => {
            this.escolas = Object.values(response);
            if (this.escolas.length > 0) {
              this.totalRegistros = parseInt(this.escolas[0]["total"]);
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

    if (this.escopoUsuario == CONSTANTES.ESCOPO_REGIONAL) {
      if (this.statusFiltro) {
        this.saltarQuantidade = limit;
        this.feedbackUsuario = undefined;
        this.feedbackUsuario = "Carregando dados, aguarde...";
        let esc_id: number = parseInt(Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT));
        this.escolaService
          .filtrarRegional(this.valorFiltro, limit, offset, esc_id)
          .toPromise()
          .then((response: Response) => {
            this.escolas = Object.values(response);
            if (this.escolas.length > 0) {
              this.totalRegistros = parseInt(this.escolas[0]["total"]);
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

    if (this.escopoUsuario == CONSTANTES.ESCOPO_LOCAL) {
      if (this.statusFiltro) {
        this.saltarQuantidade = limit;
        this.feedbackUsuario = undefined;
        this.feedbackUsuario = "Carregando dados, aguarde...";
        let esc_id: number = parseInt(Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT));
        this.escolaService
          .filtrarLocal(this.valorFiltro, limit, offset, esc_id)
          .toPromise()
          .then((response: Response) => {
            this.escolas = Object.values(response);
            if (this.escolas.length > 0) {
              this.totalRegistros = parseInt(this.escolas[0]["total"]);
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
  }

  public inserir(): void {
    this.router.navigate([`${this.route.parent.routeConfig.path}/inserir-escola`]);
  }

  public inserirDiretorEscola(): void {
    let navigationExtras: NavigationExtras = {
      queryParams: { origem: "listar-escola" }
    };
    this.router.navigate(["inserir-diretor-escola"], navigationExtras);
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

}
