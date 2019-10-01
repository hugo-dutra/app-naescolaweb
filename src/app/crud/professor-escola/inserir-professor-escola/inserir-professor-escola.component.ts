import { Component, OnInit } from '@angular/core';
import { ProfessorEscolaService } from '../professor-escola.service';
import { EscolaService } from '../../escola/escola.service';
import { ProfessorService } from '../../professor/professor.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { ProfessorEscola } from '../professor-escola.model';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-inserir-professor-escola',
  templateUrl: './inserir-professor-escola.component.html',
  styleUrls: ['./inserir-professor-escola.component.scss'],
  providers: [ProfessorEscolaService, EscolaService, ProfessorService],
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
export class InserirProfessorEscolaComponent implements OnInit {

  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;
  public exibeTodos: boolean = true;
  public primeiraCarga: boolean = true;

  private arrayOfEscolas = new Array<number>();
  private arrayOfProfessores = new Array<number>();
  private arrayOfProfessoresEscolas = new Array<ProfessorEscola>();
  private matrizReferencia = new Array<Object>();

  public professores = new Array<Object>();
  public escolas = new Array<Object>();

  constructor(
    private professorEscolaService: ProfessorEscolaService,
    private escolaService: EscolaService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private professorService: ProfessorService,
    private router: Router
  ) { }

  public formulario = new FormGroup({
    check_professor: new FormControl(null),
    check_escola: new FormControl(null)
  });

  ngOnInit() {
    this.carregarDadosEscolaProfessor();
  }

  public carregarDadosEscolaProfessor(): void {
    this.carregarProfessores(this.exibeTodos);

  }

  public listar(): void {
    this.router.navigate(["listar-professor"]);
  }

  private carregarEscolas(): void {
    this.feedbackUsuario = "Carregando escolas...";
    this.escolaService
      .listar(5000, 0, true)
      .toPromise()
      .then((response: Response) => {
        this.escolas = Object.values(response);
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

  public exibirTodos(): void {
    this.exibeTodos = !this.exibeTodos;
    this.carregarProfessores(this.exibeTodos);
  }

  private carregarProfessores(todos: boolean): void {
    this.limparProfessores();
    if (todos == true) {
      this.feedbackUsuario = "Carregando professores...";
      this.professorService
        .listar(50000, 0, true)
        .toPromise()
        .then((response: Response) => {
          this.professores = Object.values(response);
          this.matrizReferencia = this.professores;
          this.feedbackUsuario = undefined;
          if (this.primeiraCarga) {
            this.primeiraCarga = false;
            this.carregarEscolas();
          }
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
    } else {
      this.feedbackUsuario = "Carregando professores sem escola...";
      this.professorService
        .listarSemEscola()
        .toPromise()
        .then((response: Response) => {
          this.professores = Object.values(response);
          this.matrizReferencia = this.professores;
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

  public gravaStatusEscolas(event: Event): void {
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
  }

  public carregarProfessorEscola(): void {
    this.arrayOfProfessoresEscolas = [];
    for (let i = 0; i < this.arrayOfEscolas.length; i++) {
      for (let j = 0; j < this.arrayOfProfessores.length; j++) {
        let professorEscola = new ProfessorEscola();
        professorEscola.esc_id = this.arrayOfEscolas[i];
        professorEscola.prf_id = this.arrayOfProfessores[j];
        this.arrayOfProfessoresEscolas.push(professorEscola);
      }
    }
  }

  public inserir(): void {
    this.carregarProfessorEscola();
    this.feedbackUsuario = "Salvando dados, aguarde...";
    this.professorEscolaService
      .inserir(this.arrayOfProfessoresEscolas)
      .toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = undefined;
        this.limparTudo();
        this.carregarProfessores(this.exibeTodos);
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

  public limparTudo() {
    this.formulario.reset();
    this.arrayOfProfessores = [];
    this.arrayOfEscolas = [];
  }

  public limparProfessores(): void {
    this.arrayOfProfessores = [];
  }

  public alertarChecksVazios() {
    if (
      this.arrayOfProfessores.length != 0 &&
      this.arrayOfEscolas.length != 0
    ) {
      this.exibirAlerta = false;
    }

    if (
      this.arrayOfProfessores.length == 0 ||
      this.arrayOfEscolas.length == 0
    ) {
      this.exibirAlerta = true;
    }
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
      setTimeout(() => {
        this.professores = this.matrizReferencia
        this.formulario.reset();
        this.arrayOfProfessores.length = 0;
        this.arrayOfEscolas.length = 0;
        this.feedbackUsuario = undefined;
        this.filtrarProfessor(event);
      }, 50)
    }
  }
}
