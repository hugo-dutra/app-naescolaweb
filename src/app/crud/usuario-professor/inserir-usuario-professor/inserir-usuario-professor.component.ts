import { Component, OnInit } from '@angular/core';
import { UsuarioProfessorService } from '../usuario-professor.service';
import { UsuarioService } from '../../usuario/usuario.service';
import { ProfessorService } from '../../professor/professor.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Router } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Utils } from '../../../shared/utils.shared';
import { UsuarioProfessor } from '../usuario-professor.model';

@Component({
  selector: 'ngx-inserir-usuario-professor',
  templateUrl: './inserir-usuario-professor.component.html',
  styleUrls: ['./inserir-usuario-professor.component.scss'],
  providers: [UsuarioProfessorService, UsuarioService, ProfessorService],
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
export class InserirUsuarioProfessorComponent implements OnInit {

  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;
  public exibeTodosProfessores: boolean = false;
  public exibeTodosUsuarios: boolean = false;
  public primeiraExecucao: boolean = true;

  public usuarios = new Array<Object>();
  public professores = new Array<Object>();
  public matrizReferenciaUsuario = new Array<Object>();
  public matrizReferenciaProfessor = new Array<Object>();

  public usr_id_selecionado: number;
  public prf_id_selecionado: number;

  public dados_escola = new Array<Object>();
  public esc_id: number;

  constructor(
    private router: Router,
    private usuarioProfessorService: UsuarioProfessorService,
    private usuarioService: UsuarioService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private professorService: ProfessorService
  ) { }

  public formulario = new FormGroup({
    usuario_option: new FormControl(null),
    professor_option: new FormControl(null)
  });

  ngOnInit() {
    this.dados_escola = JSON.parse(Utils.decriptAtoB(localStorage.getItem("dados_escola"), CONSTANTES.PASSO_CRIPT))[0];
    this.esc_id = parseInt(this.dados_escola["id"]);
    this.carregarDadosComponente();
  }

  private carregarDadosComponente(): void {
    this.listarProfessores().then(() => {
      this.listarUsuarios();
    })
  }

  private listarUsuarios(): Promise<any> {
    this.feedbackUsuario = "Carregando usuários, aguarde...";
    return this.usuarioService
      .listarPorEscola(this.esc_id, this.exibeTodosUsuarios)
      .toPromise()
      .then((response: Response) => {
        this.usuarios = Object.values(response);
        this.matrizReferenciaUsuario = this.usuarios;
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

  private listarProfessores(): Promise<any> {
    this.feedbackUsuario = "Carregando professores, aguarde...";
    return this.professorService
      .listarPorEscola(this.esc_id, this.exibeTodosProfessores)
      .toPromise()
      .then((response: Response) => {
        this.professores = Object.values(response);
        this.matrizReferenciaProfessor = this.professores;
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

  public gravaStatusProfessor(event: Event): void {
    let nome: string = (<HTMLInputElement>event.target).id;
    let status: boolean = (<HTMLInputElement>event.target).checked;

    if (status) {
      this.prf_id_selecionado = parseInt(nome.split("_")[1]);
    } else {
      this.prf_id_selecionado = 0;
    }
    this.alertarChecksVazios();
  }

  public gravaStatusUsuario(event: Event): void {
    let nome: string = (<HTMLInputElement>event.target).id;
    let status: boolean = (<HTMLInputElement>event.target).checked;
    if (status) {
      this.usr_id_selecionado = parseInt(nome.split("_")[1]);
    } else {
      this.usr_id_selecionado = 0;
    }
    this.alertarChecksVazios();
  }

  public exibirTodosProfessores(): void {
    this.exibeTodosProfessores = !this.exibeTodosProfessores;
    this.listarProfessores();
  }

  public exibirTodosUsuarios(): void {
    this.exibeTodosUsuarios = !this.exibeTodosUsuarios;
    this.listarUsuarios();
  }

  public alertarChecksVazios() {
    if (
      this.prf_id_selecionado != 0 &&
      this.usr_id_selecionado != 0
    ) {
      this.exibirAlerta = false;
    }

    if (
      this.prf_id_selecionado == 0 ||
      this.usr_id_selecionado == 0
    ) {
      this.exibirAlerta = true;
    }
  }

  public inserir(): void {
    this.feedbackUsuario = "Salvando dados, aguarde...";
    let usuarioProfessor = new UsuarioProfessor();
    usuarioProfessor.usr_id = this.usr_id_selecionado;
    usuarioProfessor.prf_id = this.prf_id_selecionado;
    if (usuarioProfessor.usr_id != 0 && usuarioProfessor.prf_id != 0) {
      this.usuarioProfessorService.inserir(usuarioProfessor).toPromise().then((response: Response) => {
        this.feedbackUsuario = undefined;
        this.limparDados();
      }).catch((erro: Response) => {
        this.feedbackUsuario = undefined;
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
      })
    } else {
      this.alertarChecksVazios();
    }
  }

  public listar(): void {
    this.router.navigate(["listar-usuario"]);
  }

  public limparDados(): void {
    this.usr_id_selecionado = 0;
    this.prf_id_selecionado = 0;
    this.limparOptions();
  }

  public limparOptions(): void {
    Array.from(document.getElementsByName("option_professor")).forEach(elem => {
      (<HTMLInputElement>elem).checked = false;
    })
    Array.from(document.getElementsByName("option_usuario")).forEach(elem => {
      (<HTMLInputElement>elem).checked = false;
    })
  }

  public filtrarProfessor(event: Event): void {
    let valorFiltro = (<HTMLInputElement>event.target).value;
    let matrizRetorno = new Array<Object>();
    matrizRetorno = this.professores.filter((elemento) => {
      return elemento["professor"].toLowerCase().indexOf(valorFiltro.toLocaleLowerCase()) != -1;
    })
    if (valorFiltro.length > 0) {
      this.professores = matrizRetorno;
    } else {
      this.professores = this.matrizReferenciaProfessor;
    }
  }

  public limparFiltroProfessor(event: KeyboardEvent): void {
    if (event.key == 'Backspace' || event.key == 'Delete') {
      setTimeout(() => {
        this.professores = this.matrizReferenciaProfessor
        this.feedbackUsuario = undefined;
        this.formulario.reset();
        this.prf_id_selecionado = 0;
        this.filtrarProfessor(event);
      }, 50)
    }
  }

  public filtrarUsuario(event: Event): void {
    let valorFiltro = (<HTMLInputElement>event.target).value;
    let matrizRetorno = new Array<Object>();
    matrizRetorno = this.usuarios.filter((elemento) => {
      return elemento["usuario"].toLowerCase().indexOf(valorFiltro.toLocaleLowerCase()) != -1;
    })
    if (valorFiltro.length > 0) {
      this.usuarios = matrizRetorno;
    } else {
      this.usuarios = this.matrizReferenciaUsuario;
    }
  }

  public limparFiltroUsuario(event: KeyboardEvent): void {
    if (event.key == 'Backspace' || event.key == 'Delete') {
      setTimeout(() => {
        this.usuarios = this.matrizReferenciaUsuario;
        this.feedbackUsuario = undefined;
        this.formulario.reset();
        this.usr_id_selecionado = 0;
        this.filtrarUsuario(event);
      }, 50)
    }
  }

}
