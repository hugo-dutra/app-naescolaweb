import { Component, OnInit } from '@angular/core';
import { ProfessorDisciplinaService } from '../professor-disciplina.service';
import { DisciplinaService } from '../../disciplina/disciplina.service';
import { ProfessorService } from '../../professor/professor.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';
import { ProfessorDisciplina } from '../professor-disciplina.model';

@Component({
  selector: 'ngx-inserir-professor-disciplina',
  templateUrl: './inserir-professor-disciplina.component.html',
  styleUrls: ['./inserir-professor-disciplina.component.scss'],
  providers: [ProfessorDisciplinaService, DisciplinaService, ProfessorService],
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
export class InserirProfessorDisciplinaComponent implements OnInit {
  public disciplinas: Object;
  public professores: Array<Object>;
  public matrizReferencia: Array<Object>;
  public estado: string = "visivel";

  public professorDisciplina = new ProfessorDisciplina();
  public statusCheck: boolean;
  public feedbackUsuario: string;
  private arrayOfProfessores = new Array<number>();
  private arrayOfDisciplinas = new Array<number>();
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;
  public exibeTodos: boolean = true;
  public primeiraExecucao: boolean = true;
  public dados_escola: Object;
  public esc_id: number;

  public formulario = new FormGroup({
    check_professor: new FormControl(null),
    check_disciplina: new FormControl(null)
  });

  constructor(
    private professorDisciplinaService: ProfessorDisciplinaService,
    private professorService: ProfessorService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private disciplinaService: DisciplinaService,
    private router: Router
  ) { }

  ngOnInit() {
    this.dados_escola = JSON.parse(
      Utils.decriptAtoB(
        localStorage.getItem("dados_escola"),
        CONSTANTES.PASSO_CRIPT
      )
    )[0];
    this.esc_id = parseInt(this.dados_escola["id"]);
    this.listarDados();
  }

  public listarDados(): void {
    this.listarProfessores(this.exibeTodos);
  }

  public exibirTodos(): void {
    this.exibeTodos = !this.exibeTodos;
    this.listarProfessores(this.exibeTodos);
  }

  public listarProfessores(todos: boolean): void {
    if (this.exibeTodos) {
      this.listarTodosProfessores();
    } else {
      this.listarProfessoresSemDisciplina();
    }
  }

  public listarProfessoresSemDisciplina(): void {
    this.feedbackUsuario = "Carregando, aguarde...";
    this.professorService
      .listarSemDisciplina(50000, 0, true)
      .toPromise()
      .then((response: Response) => {
        this.professores = Object.values(response);
      })
      .then(() => {
        if (this.primeiraExecucao) {
          this.listarDisciplinas();
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

  public filtrarProfessor(event: Event): void {
    let valorFiltro = (<HTMLInputElement>event.target).value;
    let matrizRetorno = new Array<Object>();
    matrizRetorno = this.professores.filter((elemento) => {
      return elemento["nome"].toLowerCase().indexOf(valorFiltro.toLocaleLowerCase()) != -1;
    })
    if (valorFiltro.length > 0) {
      this.professores = matrizRetorno;
    } else {
      this.professores = this.matrizReferencia;
    }
  }

  public limparFiltro(event: KeyboardEvent): void {
    if (event.key == 'Backspace' || event.key == 'Delete') {
      this.feedbackUsuario = "Filtrando, aguarde...";
      setTimeout(() => {
        this.professores = this.matrizReferencia
        this.feedbackUsuario = undefined;
        this.filtrarProfessor(event);
      }, 2000)
    }
  }

  public listarTodosProfessores(): void {
    this.feedbackUsuario = "Carregando, aguarde...";
    this.professorService
      .listar(50000, 0, true)
      .toPromise()
      .then((response: Response) => {
        this.professores = Object.values(response);
      })
      .then(() => {
        if (this.primeiraExecucao) {
          this.listarDisciplinas();
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

  public gravaStatusProfessores(event: Event): void {
    let nome: string = (<HTMLInputElement>event.target).name;
    let status: boolean = (<HTMLInputElement>event.target).checked;

    if (status) {
      this.arrayOfProfessores.push(parseInt(nome));
    } else {
      this.arrayOfProfessores.splice(
        this.arrayOfProfessores.indexOf(parseInt(nome), 0),
        1
      );
    }
    this.alertarChecksVazios();
  }

  public gravaStatusDisciplinas(event: Event): void {
    let nome: string = (<HTMLInputElement>event.target).name;
    let status: boolean = (<HTMLInputElement>event.target).checked;
    if (status) {
      this.arrayOfDisciplinas.push(parseInt(nome));
    } else {
      this.arrayOfDisciplinas.splice(
        this.arrayOfDisciplinas.indexOf(parseInt(nome), 0),
        1
      );
    }
    this.alertarChecksVazios();
  }

  public listarDisciplinas(): void {
    this.feedbackUsuario = "Carregando, aguarde...";
    this.disciplinaService
      .integracaoListar(this.esc_id)
      .toPromise()
      .then((response: Response) => {
        this.disciplinas = response;
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
    if (
      this.arrayOfDisciplinas.length > 0 &&
      this.arrayOfProfessores.length > 0
    ) {
      this.exibirAlerta = false;
      this.feedbackUsuario = "Salvando, aguarde...";
      this.professorDisciplinaService
        .inserir(this.arrayOfProfessores, this.arrayOfDisciplinas)
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
    this.router.navigateByUrl("listar-professor");
  }

  public limparTodosChecks() {
    this.formulario.reset();
    this.arrayOfDisciplinas.length = 0;
    this.arrayOfProfessores.length = 0;
  }

  public alertarChecksVazios() {
    if (
      this.arrayOfDisciplinas.length != 0 &&
      this.arrayOfProfessores.length != 0
    ) {
      this.exibirAlerta = false;
    }

    if (
      this.arrayOfDisciplinas.length == 0 ||
      this.arrayOfProfessores.length == 0
    ) {
      this.exibirAlerta = true;
    }
  }

}
