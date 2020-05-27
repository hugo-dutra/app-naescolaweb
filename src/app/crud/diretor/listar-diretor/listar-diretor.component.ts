import { Component, OnInit } from '@angular/core';
import { DiretorService } from '../diretor.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';
import { Diretor } from '../diretor.model';

@Component({
  selector: 'ngx-listar-diretor',
  templateUrl: './listar-diretor.component.html',
  styleUrls: ['./listar-diretor.component.scss'],
  providers: [DiretorService],
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
export class ListarDiretorComponent implements OnInit {

  constructor(private diretorService: DiretorService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router,
    private route: ActivatedRoute) { }

  public diretores = new Array<Object>();
  public feedbackUsuario: string;
  public estado: string = 'visivel';
  public tableLimit: number = 10;
  public totalRegistros: number;
  public offsetRegistros: number = 0;
  public saltarQuantidade: number = 5;
  public navegacaoInicio: boolean = undefined;
  public navegacaoFim: boolean = undefined;
  public valorFiltro: string = '';
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
    this.diretores = undefined;
    this.exibirComponentesEdicao();
    this.listar();
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
      this.feedbackUsuario = 'Carregando dados, aguarde...';
      this.diretorService
        .listar(limit, offset, false)
        .toPromise()
        .then((response: Response) => {
          this.diretores = Object.values(response);
          if (this.diretores.length > 0) {
            this.totalRegistros = parseInt(this.diretores[0]['total'], 10);
          } else {
            this.totalRegistros = 0;
          }
          this.feedbackUsuario = undefined;
          this.verificaLimitesNavegacao();
        })
        .catch((erro: Response) => {
          this.tratarErro(erro);
        });
    }

    if (this.escopoUsuario == CONSTANTES.ESCOPO_REGIONAL) {
      this.saltarQuantidade = limit;
      this.feedbackUsuario = undefined;
      this.feedbackUsuario = 'Carregando dados, aguarde...';
      const esc_id: number = parseInt(Utils.decriptAtoB(localStorage.getItem('esc_id'), CONSTANTES.PASSO_CRIPT), 10);
      this.diretorService
        .listarRegional(limit, offset, false, esc_id)
        .toPromise()
        .then((response: Response) => {
          this.diretores = Object.values(response);
          if (this.diretores.length > 0) {
            this.totalRegistros = parseInt(this.diretores[0]['total'], 10);
          } else {
            this.totalRegistros = 0;
          }
          this.feedbackUsuario = undefined;
          this.verificaLimitesNavegacao();
        })
        .catch((erro: Response) => {
          this.tratarErro(erro);
        });
    }

    if (this.escopoUsuario == CONSTANTES.ESCOPO_LOCAL) {
      this.saltarQuantidade = limit;
      this.feedbackUsuario = undefined;
      this.feedbackUsuario = 'Carregando dados, aguarde...';
      const esc_id: number = parseInt(Utils.decriptAtoB(localStorage.getItem('esc_id'), CONSTANTES.PASSO_CRIPT), 10);
      this.diretorService
        .listarLocal(limit, offset, false, esc_id)
        .toPromise()
        .then((response: Response) => {
          this.diretores = Object.values(response);
          if (this.diretores.length > 0) {
            this.totalRegistros = parseInt(this.diretores[0]['total'], 10);
          } else {
            this.totalRegistros = 0;
          }
          this.feedbackUsuario = undefined;
          this.verificaLimitesNavegacao();
        })
        .catch((erro: Response) => {
          this.tratarErro(erro);
        });
    }


  }

  public alterar(diretor: Diretor): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        diretor: JSON.stringify(diretor)
      },
    };
    this.router.navigate([`${this.route.parent.routeConfig.path}/alterar-diretor`], navigationExtras);
  }

  public excluir(diretor: Diretor): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        diretor: JSON.stringify(diretor)
      },
    };
    this.router.navigate([`${this.route.parent.routeConfig.path}/excluir-diretor`], navigationExtras);
  }

  // Método de navegação otimizado. Replicar para demais listagens.
  public navegarProximo() {
    if (!this.navegacaoFim) {
      this.offsetRegistros = this.offsetRegistros + this.saltarQuantidade;
      this.filtrarNavegacao(this.saltarQuantidade, this.offsetRegistros);
    }
    this.verificaLimitesNavegacao();
  }

  // Método de navegação otimizado. Replicar para demais listagens.
  public navegarAnterior() {
    if (!this.navegacaoInicio) {
      this.offsetRegistros = this.offsetRegistros - this.saltarQuantidade;
      this.filtrarNavegacao(this.saltarQuantidade, this.offsetRegistros);
    }
    this.verificaLimitesNavegacao();
  }

  public verificaLimitesNavegacao(): void {
    // Verifica se deve desabilitar botao de registro Anterior.
    if (this.offsetRegistros + this.saltarQuantidade <= this.saltarQuantidade) {
      this.navegacaoInicio = true;
      this.navegacaoFim = false;
    } else {
      this.navegacaoInicio = false;
    }
    // Verifica se deve desabilitar botao de registro seguinte.
    if (this.offsetRegistros + this.saltarQuantidade >= this.totalRegistros) {
      this.navegacaoFim = true;
      this.navegacaoInicio = false;
    } else {
      this.navegacaoFim = false;
    }
    // Quantidade de registros é inferior ao tamanho do saltarQuantidade
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
    if (event.key == 'Enter') {
      this.filtrar();
    }
  }

  public ordenarColuna(campo: string): void {
    if (!this.decrescente) {
      const retorno = this.diretores.sort(function (a, b) {
        if (a[campo] < b[campo]) {
          return 1;
        }
        if (a[campo] > b[campo]) {
          return -1;
        }
        return 0;
      });
      this.diretores = retorno;

    } else {
      const retorno = this.diretores.sort(function (a, b) {
        if (a[campo] > b[campo]) {
          return 1;
        }
        if (a[campo] < b[campo]) {
          return -1;
        }
        return 0;
      });
      this.diretores = retorno;
    }
    this.decrescente = !this.decrescente;
  }

  public filtrar(limit: number = 5, offset: number = 0): void {
    if (this.escopoUsuario == CONSTANTES.ESCOPO_GLOBAL) {
      if (this.statusFiltro) {
        this.saltarQuantidade = limit;
        this.offsetRegistros = 0;
        this.feedbackUsuario = undefined;
        this.feedbackUsuario = 'Carregando dados, aguarde...';
        this.diretorService
          .filtrar(this.valorFiltro, limit, offset)
          .toPromise()
          .then((response: Response) => {
            this.diretores = Object.values(response);
            if (this.diretores.length > 0) {
              this.totalRegistros = parseInt(this.diretores[0]['total'], 10);
            } else {
              this.totalRegistros = 0;
            }
            this.feedbackUsuario = undefined;
            this.verificaLimitesNavegacao();
          })
          .catch((erro: Response) => {
            this.tratarErro(erro);
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
        this.feedbackUsuario = 'Carregando dados, aguarde...';
        const esc_id: number = parseInt(Utils.decriptAtoB(localStorage.getItem('esc_id'), CONSTANTES.PASSO_CRIPT), 10);
        this.diretorService
          .filtrarRegional(this.valorFiltro, limit, offset, esc_id)
          .toPromise()
          .then((response: Response) => {
            this.diretores = Object.values(response);
            if (this.diretores.length > 0) {
              this.totalRegistros = parseInt(this.diretores[0]['total'], 10);
            } else {
              this.totalRegistros = 0;
            }
            this.feedbackUsuario = undefined;
            this.verificaLimitesNavegacao();
          })
          .catch((erro: Response) => {
            this.tratarErro(erro);
          });
      } else {
        this.listar(limit, offset);
      }
    }

    if (this.escopoUsuario == CONSTANTES.ESCOPO_LOCAL) {
      if (this.statusFiltro) {
        this.saltarQuantidade = limit;
        this.offsetRegistros = 0;
        this.feedbackUsuario = undefined;
        this.feedbackUsuario = 'Carregando dados, aguarde...';
        const esc_id: number = parseInt(Utils.decriptAtoB(localStorage.getItem('esc_id'), CONSTANTES.PASSO_CRIPT), 10);
        this.diretorService
          .filtrarLocal(this.valorFiltro, limit, offset, esc_id)
          .toPromise()
          .then((response: Response) => {
            this.diretores = Object.values(response);
            if (this.diretores.length > 0) {
              this.totalRegistros = parseInt(this.diretores[0]['total'], 10);
            } else {
              this.totalRegistros = 0;
            }
            this.feedbackUsuario = undefined;
            this.verificaLimitesNavegacao();
          })
          .catch((erro: Response) => {
            this.tratarErro(erro);
          });
      } else {
        this.listar(limit, offset);
      }
    }

  }

  public filtrarNavegacao(limit: number = 5, offset: number = 0): void {
    if (this.statusFiltro) {
      this.saltarQuantidade = limit;
      this.feedbackUsuario = undefined;
      this.feedbackUsuario = 'Carregando dados, aguarde...';
      this.diretorService
        .filtrar(this.valorFiltro, limit, offset)
        .toPromise()
        .then((response: Response) => {
          this.diretores = Object.values(response);
          if (this.diretores.length > 0) {
            this.totalRegistros = parseInt(this.diretores[0]['total'], 10);
          } else {
            this.totalRegistros = 0;
          }
          this.feedbackUsuario = undefined;
          this.verificaLimitesNavegacao();
        })
        .catch((erro: Response) => {
          this.tratarErro(erro);
        });
    } else {
      this.listar(limit, offset);
    }
  }

  public inserir(): void {
    this.router.navigate([`${this.route.parent.routeConfig.path}/inserir-diretor`]);
  }

  public inserirDiretorEscola(): void {
    const navigationExtras: NavigationExtras = {
      queryParams: { origem: 'listar-diretor' },
    };
    this.router.navigate(['inserir-diretor-escola'], navigationExtras);
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

  public exibirComponentesEdicao(): void {
    this.exibirComponenteAlterar = Utils.exibirComponente('alterar-diretor');
    this.exibirComponenteExcluir = Utils.exibirComponente('excluir-diretor');
    this.exibirComponenteInserir = Utils.exibirComponente('inserir-diretor');
  }

  public tratarErro(erro: Response): void {
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
  }

}
