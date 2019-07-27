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
    PerfilService
  ],
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
export class InserirUsuarioEscolaComponent implements OnInit {

  public usuarios: Array<Object>;
  public escolas: Object;
  public perfis: Object;

  public matrizReferencia: Array<Object>;
  public usuarioEscola = new UsuarioEscola();
  public statusCheck: boolean;
  public feedbackUsuario: string;
  private arrayOfUsuarios = new Array<number>();
  private arrayOfEscolas = new Array<number>();
  private arrayOfPerfis = new Array<number>();

  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;
  public exibeTodos: boolean = true;
  public primeiraExecucao: boolean = true;

  constructor(
    private usuarioEscolaService: UsuarioEscolaService,
    private escolaService: EscolaService,
    private usuarioService: UsuarioService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private perfilService: PerfilService,
    private router: Router
  ) { }

  ngOnInit() {
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
    if (this.exibeTodos) {
      this.listarTodosUsuarios();
    } else {
      this.listarUsuariosSemEscola();
    }
  }

  public filtrarUsuario(event: Event): void {
    let valorFiltro = (<HTMLInputElement>event.target).value;
    let matrizRetorno = new Array<Object>();
    matrizRetorno = this.usuarios.filter((elemento) => {
      return elemento["nome"].toLowerCase().indexOf(valorFiltro.toLocaleLowerCase()) != -1;
    })
    if (valorFiltro.length > 0) {
      this.usuarios = matrizRetorno;
    } else {
      this.usuarios = this.matrizReferencia;
    }
  }

  public limparFiltro(event: KeyboardEvent): void {
    if (event.key == 'Backspace' || event.key == 'Delete') {
      this.feedbackUsuario = "Filtrando, aguarde...";
      setTimeout(() => {
        this.usuarios = this.matrizReferencia
        this.feedbackUsuario = undefined;
        this.filtrarUsuario(event);
      }, 2000)
    }
  }

  public listarUsuariosSemEscola(): void {
    this.feedbackUsuario = "Carregando, aguarde...";
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
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      });
  }

  public listarTodosUsuarios(): void {
    this.feedbackUsuario = "Carregando, aguarde...";
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
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
      });
  }

  public gravaStatusUsuario(event: Event): void {
    let nome: string = (<HTMLInputElement>event.target).name;
    let status: boolean = (<HTMLInputElement>event.target).checked;

    if (status) {
      this.arrayOfUsuarios.push(parseInt(nome));
    } else {
      this.arrayOfUsuarios.splice(
        this.arrayOfUsuarios.indexOf(parseInt(nome), 0),
        1
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
    let esc_id: number = parseInt((<HTMLInputElement>event.target).name);
    let perfil_id: number = parseInt((<HTMLInputElement>event.target).value);

    this.arrayOfEscolas.push(esc_id);
    this.arrayOfPerfis.push(perfil_id);

    this.alertarChecksVazios();
  }

  public listarEscolas(): void {
    this.feedbackUsuario = "Carregando, aguarde...";
    this.escolaService
      .listar(50000, 0, true)
      .toPromise()
      .then((response: Response) => {
        this.escolas = response;
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

  public listarPerfis(): void {
    this.feedbackUsuario = "Carregando, aguarde...";
    this.perfilService
      .listar()
      .toPromise()
      .then((response: Response) => {
        this.perfis = response;
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

  public inserir(event: Event): void {
    if (this.arrayOfUsuarios.length > 0 && this.arrayOfEscolas.length > 0) {
      this.exibirAlerta = false;
      this.feedbackUsuario = "Salvando, aguarde...";
      this.usuarioEscolaService
        .inserir(this.arrayOfUsuarios, this.arrayOfEscolas, this.arrayOfPerfis)
        .toPromise()
        .then((response: Response) => {
          this.feedbackUsuario = undefined;
          this.limparTodosChecks();
        })
        .catch((erro: Response) => {
          //Mostra modal
          this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
          //registra log de erro no firebase usando serviço singlenton
          this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
          //Caso token seja invalido, reenvia rota para login
          Utils.tratarErro({ router: this.router, response: erro });
          this.feedbackUsuario = undefined;
          this.limparTodosChecks();
        });
    } else {
      this.exibirAlerta = true;
    }
  }

  public listar(): void {
    this.router.navigateByUrl("listar-usuario");
  }

  public limparTodosChecks() {
    this.arrayOfUsuarios.length = 0;
    this.arrayOfEscolas.length = 0;
    this.arrayOfPerfis.length = 0;
  }

  public alertarChecksVazios() {
    if (this.arrayOfUsuarios.length != 0 && this.arrayOfEscolas.length != 0) {
      this.exibirAlerta = false;
    }

    if (this.arrayOfUsuarios.length == 0 || this.arrayOfEscolas.length == 0) {
      this.exibirAlerta = true;
    }
  }
}
