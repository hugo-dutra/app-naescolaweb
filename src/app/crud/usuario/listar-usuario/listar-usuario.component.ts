import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../usuario.service';
import { PerfilService } from '../../perfil/perfil.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Router, NavigationExtras } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Utils } from '../../../shared/utils.shared';
import { Usuario } from '../usuario.model';

@Component({
  selector: 'ngx-listar-usuario',
  templateUrl: './listar-usuario.component.html',
  styleUrls: ['./listar-usuario.component.scss'],
  providers: [UsuarioService, PerfilService],
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
export class ListarUsuarioComponent implements OnInit {

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private perfilService: PerfilService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
  ) { }
  public perfis: Object;
  public usuarios = new Array<Object>();
  public estado: string = 'visivel';
  public tableLimit: number = 10;
  public totalRegistros: number;
  public offsetRegistros: number = 0;
  public saltarQuantidade: number = 5;
  public navegacaoInicio: boolean = undefined;
  public navegacaoFim: boolean = undefined;
  public valorFiltro: string = '';
  public statusFiltro: boolean = false;
  public feedbackUsuario: string;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirComponenteAlterar: Boolean = false;
  public exibirComponenteInserir: Boolean = false;
  public exibirComponenteExcluir: Boolean = false;
  public exibirComponenteReiniciarSenha: Boolean = false;
  public decrescente: boolean = true;
  public escopoUsuario: string;
  public esc_id: number;

  ngOnInit() {
    this.esc_id = Utils.pegarDadosEscolaDetalhado().id;
    this.escopoUsuario = Utils.pegarDadosEscopo().nome;
    this.exibirComponentesEdicao();
    this.listarPerfis();
    this.listar();
  }

  public listarQuantidade(event: Event) {
    this.navegacaoInicio = undefined;
    this.navegacaoFim = undefined;
    this.offsetRegistros = 0;
    this.saltarQuantidade = parseInt((<HTMLInputElement>event.target).value, 10);
    if (this.statusFiltro) {
      this.filtrar(this.saltarQuantidade);
    } else {
      this.listar(this.saltarQuantidade);
    }
  }

  public exibirComponentesEdicao(): void {
    this.exibirComponenteAlterar = Utils.exibirComponente('alterar-usuario');
    this.exibirComponenteExcluir = Utils.exibirComponente('excluir-usuario');
    this.exibirComponenteInserir = Utils.exibirComponente('inserir-usuario');
    this.exibirComponenteReiniciarSenha = Utils.exibirComponente('reiniciar-senha-usuario');
  }


  public listarPerfis(): void {
    this.feedbackUsuario = 'Carregando dados, aguarde...';
    const nivelPerfil = Utils.pegarDadosEscopo().nivel;
    this.perfilService
      .listar(nivelPerfil, this.esc_id)
      .toPromise()
      .then((response: Response) => {
        this.perfis = response;
        this.feedbackUsuario = undefined;
      })
      .catch((erro: Response) => {
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
      });
  }

  public listar(limit: number = 5, offset: number = 0): void {

    if (this.escopoUsuario === CONSTANTES.ESCOPO_GLOBAL) {
      this.saltarQuantidade = limit;
      this.feedbackUsuario = undefined;
      this.feedbackUsuario = 'Carregando dados, aguarde...';
      this.usuarioService
        .listar(limit, offset, false)
        .toPromise()
        .then((response: Response) => {
          this.usuarios = Object.values(response);
          if (this.usuarios.length > 0) {
            this.totalRegistros = parseInt(this.usuarios[0]['total'], 10);
          } else {
            this.totalRegistros = 0;
          }
          this.feedbackUsuario = undefined;
          this.verificaLimitesNavegacao();
        })
        .catch((erro: Response) => {
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
        });
    }

    if (this.escopoUsuario === CONSTANTES.ESCOPO_REGIONAL) {
      this.saltarQuantidade = limit;
      this.feedbackUsuario = undefined;
      this.feedbackUsuario = 'Carregando dados, aguarde...';
      const esc_id: number = parseInt(Utils.decriptAtoB(localStorage.getItem('esc_id'), CONSTANTES.PASSO_CRIPT), 10);
      this.usuarioService
        .listarRegional(limit, offset, false, esc_id)
        .toPromise()
        .then((response: Response) => {
          this.usuarios = Object.values(response);
          if (this.usuarios.length > 0) {
            this.totalRegistros = parseInt(this.usuarios[0]['total'], 10);
          } else {
            this.totalRegistros = 0;
          }
          this.feedbackUsuario = undefined;
          this.verificaLimitesNavegacao();
        })
        .catch((erro: Response) => {
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
        });
    }

    if (this.escopoUsuario === CONSTANTES.ESCOPO_LOCAL) {
      this.saltarQuantidade = limit;
      this.feedbackUsuario = undefined;
      this.feedbackUsuario = 'Carregando dados, aguarde...';
      const esc_id: number = parseInt(Utils.decriptAtoB(localStorage.getItem('esc_id'), CONSTANTES.PASSO_CRIPT), 10);
      this.usuarioService
        .listarLocal(limit, offset, false, esc_id)
        .toPromise()
        .then((response: Response) => {
          this.usuarios = Object.values(response);
          if (this.usuarios.length > 0) {
            this.totalRegistros = parseInt(this.usuarios[0]['total'], 10);
          } else {
            this.totalRegistros = 0;
          }
          this.feedbackUsuario = undefined;
          this.verificaLimitesNavegacao();
        })
        .catch((erro: Response) => {
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
        });
    }
  }

  public reiniciarSenha(usuario: Usuario): void {
    this.feedbackUsuario = 'Reiniciando a senha do usuário, aguarde...';
    const novaSenha = `${usuario.email.split('@')[0]}@${(new Date()).getFullYear().toString()}`;
    this.usuarioService.modificarSenha(usuario['id'], novaSenha).toPromise().then((response: Response) => {
      this.feedbackUsuario = undefined;
    }).catch((erro: Response) => {
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
    });
  }

  public alterar(usuario: Usuario): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        usuario: JSON.stringify(usuario),
      },
    };
    this.router.navigate([`${this.router.url}/alterar-usuario`], navigationExtras);
  }

  public excluir(usuario: Usuario): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        usuario: JSON.stringify(usuario),
      },
    };
    this.router.navigate([`${this.router.url}/excluir-usuario`], navigationExtras);
  }

  // Método de navegação otimizado. Replicar para demais listagens.
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

  // Método de navegação otimizado. Replicar para demais listagens.
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
    if (event.key === 'Enter') {
      this.filtrar();
    }
  }

  public ordenarColuna(campo: string): void {
    if (!this.decrescente) {
      const retorno = this.usuarios.sort(function (a, b) {
        if (a[campo] < b[campo]) {
          return 1;
        }
        if (a[campo] > b[campo]) {
          return -1;
        }
        return 0;
      });
      this.usuarios = retorno;

    } else {
      const retorno = this.usuarios.sort(function (a, b) {
        if (a[campo] > b[campo]) {
          return 1;
        }
        if (a[campo] < b[campo]) {
          return -1;
        }
        return 0;
      });
      this.usuarios = retorno;
    }
    this.decrescente = !this.decrescente;
  }

  public filtrar(limit: number = 5, offset: number = 0): void {
    if (this.escopoUsuario === CONSTANTES.ESCOPO_GLOBAL) {
      if (this.statusFiltro) {
        this.saltarQuantidade = limit;
        this.offsetRegistros = 0;
        this.feedbackUsuario = undefined;
        this.feedbackUsuario = 'Carregando dados, aguarde...';
        this.usuarioService
          .filtrar(this.valorFiltro, limit, offset)
          .toPromise()
          .then((response: Response) => {
            this.usuarios = Object.values(response);
            if (this.usuarios.length > 0) {
              this.totalRegistros = parseInt(this.usuarios[0]['total'], 10);
            } else {
              this.totalRegistros = 0;
            }
            this.feedbackUsuario = undefined;
            this.verificaLimitesNavegacao();
          })
          .catch((erro: Response) => {
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
          });
      } else {
        this.listar(limit, offset);
      }
    }

    if (this.escopoUsuario === CONSTANTES.ESCOPO_REGIONAL) {
      if (this.statusFiltro) {
        this.saltarQuantidade = limit;
        this.offsetRegistros = 0;
        this.feedbackUsuario = undefined;
        this.feedbackUsuario = 'Carregando dados, aguarde...';
        const esc_id: number = parseInt(Utils.decriptAtoB(localStorage.getItem('esc_id'), CONSTANTES.PASSO_CRIPT), 10);
        this.usuarioService
          .filtrarRegional(this.valorFiltro, limit, offset, esc_id)
          .toPromise()
          .then((response: Response) => {
            this.usuarios = Object.values(response);
            if (this.usuarios.length > 0) {
              this.totalRegistros = parseInt(this.usuarios[0]['total'], 10);
            } else {
              this.totalRegistros = 0;
            }
            this.feedbackUsuario = undefined;
            this.verificaLimitesNavegacao();
          })
          .catch((erro: Response) => {
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
          });
      } else {
        this.listar(limit, offset);
      }
    }

    if (this.escopoUsuario === CONSTANTES.ESCOPO_LOCAL) {
      if (this.statusFiltro) {
        this.saltarQuantidade = limit;
        this.offsetRegistros = 0;
        this.feedbackUsuario = undefined;
        this.feedbackUsuario = 'Carregando dados, aguarde...';
        const esc_id: number = parseInt(Utils.decriptAtoB(localStorage.getItem('esc_id'), CONSTANTES.PASSO_CRIPT), 10);
        this.usuarioService
          .filtrarLocal(this.valorFiltro, limit, offset, esc_id)
          .toPromise()
          .then((response: Response) => {
            this.usuarios = Object.values(response);
            if (this.usuarios.length > 0) {
              this.totalRegistros = parseInt(this.usuarios[0]['total'], 10);
            } else {
              this.totalRegistros = 0;
            }
            this.feedbackUsuario = undefined;
            this.verificaLimitesNavegacao();
          })
          .catch((erro: Response) => {
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
          });
      } else {
        this.listar(limit, offset);
      }
    }

  }


  public filtrarNavegacao(limit: number = 5, offset: number = 0): void {
    if (this.escopoUsuario === CONSTANTES.ESCOPO_GLOBAL) {
      if (this.statusFiltro) {
        this.saltarQuantidade = limit;
        this.feedbackUsuario = undefined;
        this.feedbackUsuario = 'Carregando dados, aguarde...';
        this.usuarioService
          .filtrar(this.valorFiltro, limit, offset)
          .toPromise()
          .then((response: Response) => {
            this.usuarios = Object.values(response);
            if (this.usuarios.length > 0) {
              this.totalRegistros = parseInt(this.usuarios[0]['total'], 10);
            } else {
              this.totalRegistros = 0;
            }
            this.feedbackUsuario = undefined;
            this.verificaLimitesNavegacao();
          })
          .catch((erro: Response) => {
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
          });
      } else {
        this.listar(limit, offset);
      }
    }

    if (this.escopoUsuario === CONSTANTES.ESCOPO_REGIONAL) {
      if (this.statusFiltro) {
        this.saltarQuantidade = limit;
        this.feedbackUsuario = undefined;
        this.feedbackUsuario = 'Carregando dados, aguarde...';
        const esc_id: number = parseInt(Utils.decriptAtoB(localStorage.getItem('esc_id'), CONSTANTES.PASSO_CRIPT), 10);
        this.usuarioService
          .filtrarRegional(this.valorFiltro, limit, offset, esc_id)
          .toPromise()
          .then((response: Response) => {
            this.usuarios = Object.values(response);
            if (this.usuarios.length > 0) {
              this.totalRegistros = parseInt(this.usuarios[0]['total'], 10);
            } else {
              this.totalRegistros = 0;
            }
            this.feedbackUsuario = undefined;
            this.verificaLimitesNavegacao();
          })
          .catch((erro: Response) => {
            // Mostra modal
            this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
            // Registra log de erro no firebase usando serviço singlenton
            this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`,
              JSON.stringify(erro));
            // Gravar erros no analytics
            Utils.gravarErroAnalytics(JSON.stringify(erro));
            // Caso token seja invalido, reenvia rota para login
            Utils.tratarErro({ router: this.router, response: erro });
            this.feedbackUsuario = undefined;
          });
      } else {
        this.listar(limit, offset);
      }
    }

    if (this.escopoUsuario === CONSTANTES.ESCOPO_LOCAL) {
      if (this.statusFiltro) {
        this.saltarQuantidade = limit;
        this.feedbackUsuario = undefined;
        this.feedbackUsuario = 'Carregando dados, aguarde...';
        const esc_id: number = parseInt(Utils.decriptAtoB(localStorage.getItem('esc_id'), CONSTANTES.PASSO_CRIPT), 10);
        this.usuarioService
          .filtrarLocal(this.valorFiltro, limit, offset, esc_id)
          .toPromise()
          .then((response: Response) => {
            this.usuarios = Object.values(response);
            if (this.usuarios.length > 0) {
              this.totalRegistros = parseInt(this.usuarios[0]['total'], 10);
            } else {
              this.totalRegistros = 0;
            }
            this.feedbackUsuario = undefined;
            this.verificaLimitesNavegacao();
          })
          .catch((erro: Response) => {
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
          });
      } else {
        this.listar(limit, offset);
      }
    }











  }

  public inserir(): void {
    this.router.navigate([`${this.router.url}/inserir-usuario`]);
  }

  public inserirUsuarioProfessor(): void {
    this.router.navigate(['inserir-usuario-professor']);
  }

  public inserirUsuarioEscola(): void {
    this.router.navigate(['inserir-usuario-escola']);
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }
}
