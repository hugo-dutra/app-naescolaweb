import { Component, OnInit } from '@angular/core';
import { UsuarioEscolaService } from '../usuario-escola.service';
import { EscolaService } from '../../escola/escola.service';
import { UsuarioService } from '../../usuario/usuario.service';
import { PerfilService } from '../../perfil/perfil.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { UsuarioEscola } from '../usuario-escola.model';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-inserir-usuario-escola',
  templateUrl: './inserir-usuario-escola.component.html',
  styleUrls: ['./inserir-usuario-escola.component.scss'],
  providers: [
    UsuarioEscolaService,
    EscolaService,
    UsuarioService,
    PerfilService,
  ],
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
export class InserirUsuarioEscolaComponent implements OnInit {

  public usuarios: Array<Object>;
  public escolas: Array<Object>;
  public perfis: Object;

  public matrizReferencia: Array<Object>;
  public matrizReferenciaEscola: Array<Object>;
  public usuarioEscola = new UsuarioEscola();
  public statusCheck: boolean;
  public feedbackUsuario: string;
  private arrayOfUsuarios = new Array<number>();
  private arrayOfEscolas = new Array<number>();
  private arrayOfPerfis = new Array<number>();

  public estado: string = 'visivel';
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;
  public exibeTodos: boolean = true;
  public primeiraExecucao: boolean = true;
  public escopoUsuario: string;
  public esc_id: number;

  constructor(
    private usuarioEscolaService: UsuarioEscolaService,
    private escolaService: EscolaService,
    private usuarioService: UsuarioService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private perfilService: PerfilService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.esc_id = Utils.pegarDadosEscolaDetalhado().id;
    this.escopoUsuario = Utils.pegarDadosEscopo().nome;
    this.listarDados();
  }

  public listarDados(): void {
    this.listarUsuarios(this.exibeTodos);
  }

  public exibirTodos(): void {
    this.exibeTodos = !this.exibeTodos;
    this.listarUsuarios(this.exibeTodos);
  }

  public listarUsuarios(todos: boolean): void {
    this.listarTodosUsuarios();
    /* if (this.exibeTodos) {
      this.listarTodosUsuarios();
    } else {
      this.listarUsuariosSemEscola();
    } */
  }

  public filtrarUsuario(event: Event): void {
    const valorFiltro = (<HTMLInputElement>event.target).value;
    let matrizRetorno = new Array<Object>();
    matrizRetorno = this.usuarios.filter((elemento) => {
      return elemento['nome'].toLowerCase().indexOf(valorFiltro.toLocaleLowerCase()) !== -1;
    });
    if (valorFiltro.length > 0) {
      this.usuarios = matrizRetorno;
    } else {
      this.usuarios = this.matrizReferencia;
    }
  }

  public filtrarEscola(event: Event): void {
    const valorFiltro = (<HTMLInputElement>event.target).value;
    let matrizRetorno = new Array<Object>();
    matrizRetorno = this.escolas.filter((elemento) => {
      return elemento['nome'].toLowerCase().indexOf(valorFiltro.toLocaleLowerCase()) !== -1;
    });
    if (valorFiltro.length > 0) {
      this.escolas = matrizRetorno;
    } else {
      this.escolas = this.matrizReferenciaEscola;
    }
  }

  public limparFiltro(event: KeyboardEvent): void {
    if (event.key === 'Backspace' || event.key === 'Delete') {
      this.feedbackUsuario = 'Filtrando, aguarde...';
      setTimeout(() => {
        this.usuarios = this.matrizReferencia;
        this.feedbackUsuario = undefined;
        this.filtrarUsuario(event);
      }, 2000);
    }
  }

  public listarUsuariosSemEscola(): void {

    /* this.feedbackUsuario = "Carregando, aguarde...";
    this.usuarioService
      .listarSemEscola()
      .toPromise()
      .then((response: Response) => {
        this.usuarios = Object.values(response);
        this.matrizReferencia = this.usuarios;
      })
      .then(() => {
        if (this.primeiraExecucao) {
          this.listarEscolas();
          this.primeiraExecucao = false;
        } else {
          this.feedbackUsuario = undefined;
        }
      })
      .catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`,
        JSON.stringify(erro));
        //Gravar erros no analytics
        Utils.gravarErroAnalytics(JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      }); */

  }

  public listarTodosUsuarios(): void {
    if (this.escopoUsuario === CONSTANTES.ESCOPO_GLOBAL) {
      this.feedbackUsuario = 'Carregando, aguarde...';
      this.usuarioService
        .listar(50000, 0, true)
        .toPromise()
        .then((response: Response) => {
          this.usuarios = Object.values(response);
          this.matrizReferencia = this.usuarios;
        })
        .then(() => {
          if (this.primeiraExecucao) {
            this.listarEscolas();
            this.listarPerfis();
            this.primeiraExecucao = false;
          } else {
            this.feedbackUsuario = undefined;
          }
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
        });
    }

    if (this.escopoUsuario === CONSTANTES.ESCOPO_REGIONAL) {
      this.feedbackUsuario = 'Carregando, aguarde...';
      const esc_id: number = parseInt(Utils.decriptAtoB(localStorage.getItem('esc_id'), CONSTANTES.PASSO_CRIPT), 10);
      this.usuarioService
        .listarRegional(50000, 0, true, esc_id)
        .toPromise()
        .then((response: Response) => {
          this.usuarios = Object.values(response);
          this.matrizReferencia = this.usuarios;
        })
        .then(() => {
          if (this.primeiraExecucao) {
            this.listarEscolas();
            this.listarPerfis();
            this.primeiraExecucao = false;
          } else {
            this.feedbackUsuario = undefined;
          }
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
        });
    }

    if (this.escopoUsuario === CONSTANTES.ESCOPO_LOCAL) {
      this.feedbackUsuario = 'Carregando, aguarde...';
      const esc_id: number = parseInt(Utils.decriptAtoB(localStorage.getItem('esc_id'), CONSTANTES.PASSO_CRIPT), 10);
      this.usuarioService
        .listarLocal(50000, 0, true, esc_id)
        .toPromise()
        .then((response: Response) => {
          this.usuarios = Object.values(response);
          this.matrizReferencia = this.usuarios;
        })
        .then(() => {
          if (this.primeiraExecucao) {
            this.listarEscolas();
            this.listarPerfis();
            this.primeiraExecucao = false;
          } else {
            this.feedbackUsuario = undefined;
          }
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

  public gravaStatusUsuario(event: Event): void {
    const nome: string = (<HTMLInputElement>event.target).name;
    const status: boolean = (<HTMLInputElement>event.target).checked;

    if (status) {
      this.arrayOfUsuarios.push(parseInt(nome, 10));
    } else {
      this.arrayOfUsuarios.splice(
        this.arrayOfUsuarios.indexOf(parseInt(nome, 10), 0),
        1,
      );
    }
    this.alertarChecksVazios();
  }

  public gravaStatusEscola(event: Event): void {
    /*
    let nome: string = (<HTMLInputElement>event.target).name;
    let status: boolean = (<HTMLInputElement>event.target).checked;

    if (status) {
      this.arrayOfEscolas.push(parseInt(nome));
    } else {
      this.arrayOfEscolas.splice(
        this.arrayOfEscolas.indexOf(parseInt(nome), 0),
        1
      );
    }
    this.alertarChecksVazios();
    */
  }

  public gravaPermissaoEscola(event: Event): void {
    const esc_id: number = parseInt((<HTMLInputElement>event.target).name, 10);
    const perfil_id: number = parseInt((<HTMLInputElement>event.target).value, 10);

    this.arrayOfEscolas.push(esc_id);
    this.arrayOfPerfis.push(perfil_id);

    this.alertarChecksVazios();
  }

  public listarEscolas(): void {

    if (this.escopoUsuario === CONSTANTES.ESCOPO_GLOBAL) {
      this.feedbackUsuario = 'Carregando, aguarde...';
      this.escolaService
        .listar(50000, 0, true)
        .toPromise()
        .then((response: Response) => {
          this.escolas = Object.values(response);
          this.matrizReferenciaEscola = this.escolas;
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

    if (this.escopoUsuario === CONSTANTES.ESCOPO_REGIONAL) {
      this.feedbackUsuario = 'Carregando, aguarde...';
      const esc_id: number = parseInt(Utils.decriptAtoB(localStorage.getItem('esc_id'), CONSTANTES.PASSO_CRIPT), 10);
      this.escolaService
        .listarRegional(50000, 0, true, esc_id)
        .toPromise()
        .then((response: Response) => {
          this.escolas = Object.values(response);
          this.matrizReferenciaEscola = this.escolas;
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

    if (this.escopoUsuario === CONSTANTES.ESCOPO_LOCAL) {
      this.feedbackUsuario = 'Carregando, aguarde...';
      const esc_id: number = parseInt(Utils.decriptAtoB(localStorage.getItem('esc_id'), CONSTANTES.PASSO_CRIPT), 10);
      this.escolaService
        .listarLocal(50000, 0, true, esc_id)
        .toPromise()
        .then((response: Response) => {
          this.escolas = Object.values(response);
          this.matrizReferenciaEscola = this.escolas;
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

  }

  public listarPerfis(): void {
    this.feedbackUsuario = 'Carregando, aguarde...';
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

  public inserir(event: Event): void {
    if (this.arrayOfUsuarios.length > 0 && this.arrayOfEscolas.length > 0) {
      this.exibirAlerta = false;
      this.feedbackUsuario = 'Salvando, aguarde...';
      this.usuarioEscolaService
        .inserir(this.arrayOfUsuarios, this.arrayOfEscolas, this.arrayOfPerfis)
        .toPromise()
        .then((response: Response) => {
          this.feedbackUsuario = undefined;
          this.limparTodosChecks();
          this.alertModalService.showAlertSuccess('Permissões salvas com sucesso');
          this.router.navigate(['/']);
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
          this.limparTodosChecks();
        });
    } else {
      this.exibirAlerta = true;
    }
  }

  public listar(): void {
    this.router.navigateByUrl('listar-usuario');
  }

  public limparTodosChecks() {
    this.arrayOfUsuarios.length = 0;
    this.arrayOfEscolas.length = 0;
    this.arrayOfPerfis.length = 0;
  }

  public alertarChecksVazios() {
    if (this.arrayOfUsuarios.length !== 0 && this.arrayOfEscolas.length !== 0) {
      this.exibirAlerta = false;
    }

    if (this.arrayOfUsuarios.length === 0 || this.arrayOfEscolas.length === 0) {
      this.exibirAlerta = true;
    }
  }
}
