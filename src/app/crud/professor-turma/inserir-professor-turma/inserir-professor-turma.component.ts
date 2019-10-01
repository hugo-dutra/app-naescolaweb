import { Component, OnInit } from '@angular/core';
import { ProfessorTurmaService } from '../professor-turma.service';
import { TurmaService } from '../../turma/turma.service';
import { ProfessorDisciplinaService } from '../../professor-disciplina/professor-disciplina.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { ProfessorTurma } from '../professor-turma.model';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-inserir-professor-turma',
  templateUrl: './inserir-professor-turma.component.html',
  styleUrls: ['./inserir-professor-turma.component.scss'],
  providers: [ProfessorTurmaService, TurmaService, ProfessorDisciplinaService],
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
export class InserirProfessorTurmaComponent implements OnInit {

  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;
  public exibeTodos: boolean = true;

  public turmas = new Array<Object>();
  public professores = new Array<Object>();
  public dados_escola = new Array<Object>();
  public arrayOfProfessores = new Array<number>();
  public arrayOfTurmas = new Array<number>();
  public matrizReferencia = new Array<Object>();
  public arrayOfProfessoresTurmas = new Array<ProfessorTurma>();


  public esc_id: number;
  public anoAtual: number;

  constructor(
    private professorTurmaService: ProfessorTurmaService,
    private turmaService: TurmaService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,

    private professorDisciplinaService: ProfessorDisciplinaService,
    private router: Router
  ) { }

  public formulario = new FormGroup({
    check_professor: new FormControl(null),
    check_turma: new FormControl(null)
  });

  ngOnInit() {
    this.dados_escola = JSON.parse(Utils.decriptAtoB(localStorage.getItem("dados_escola"), CONSTANTES.PASSO_CRIPT))[0];
    this.esc_id = parseInt(this.dados_escola["id"]);
    this.anoAtual = (new Date()).getFullYear();
    this.listarProfessoresTurmas();
  }

  public exibirTodos(): void {
    this.exibeTodos = !this.exibeTodos;
    this.listarSomenteProfessores();
  }

  public listarSomenteProfessores(): void {
    this.feedbackUsuario = "Carregando professores, aguarde...";
    this.professorDisciplinaService.listarDisciplina(this.esc_id, this.exibeTodos).toPromise().then((response: Response) => {
      this.professores = Object.values(response);
      this.matrizReferencia = this.professores;
      this.feedbackUsuario = undefined;
    }).catch((erro: Response) => {
      //Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      //registra log de erro no firebase usando serviço singlenton
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
    //Gravar erros no analytics
    Utils.gravarErroAnalytics(JSON.stringify(erro));
      //Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
      this.feedbackUsuario = undefined;
    })
  }

  public listarProfessoresTurmas(): void {
    this.feedbackUsuario = "Carregando professores, aguarde...";
    this.professorDisciplinaService.listarDisciplina(this.esc_id, this.exibeTodos).toPromise().then((response: Response) => {
      this.professores = Object.values(response);
      this.matrizReferencia = this.professores;
      this.listarTurmas();
    }).catch((erro: Response) => {
      //Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      //registra log de erro no firebase usando serviço singlenton
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
    //Gravar erros no analytics
    Utils.gravarErroAnalytics(JSON.stringify(erro));
      //Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
      this.feedbackUsuario = undefined;
    })
  }

  public listarTurmas(): void {
    this.feedbackUsuario = "Carregando turmas, aguarde...";
    this.turmaService.listarTodasAno(this.anoAtual, this.esc_id).toPromise().then((response: Response) => {
      this.turmas = Object.values(response);
      this.feedbackUsuario = undefined;
    }).catch((erro: Response) => {
      //Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      //registra log de erro no firebase usando serviço singlenton
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
    //Gravar erros no analytics
    Utils.gravarErroAnalytics(JSON.stringify(erro));
      //Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
      this.feedbackUsuario = undefined;
    })
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

  public gravaStatusTurmas(event: Event): void {
    let nome: string = (<HTMLInputElement>event.target).name;
    let status: boolean = (<HTMLInputElement>event.target).checked;
    if (status) {
      this.arrayOfTurmas.push(parseInt(nome));
    } else {
      this.arrayOfTurmas.splice(
        this.arrayOfTurmas.indexOf(parseInt(nome), 0),
        1
      );
    }
    this.alertarChecksVazios();
  }

  public carregarProfessorTurma(): void {
    this.arrayOfProfessoresTurmas = [];
    for (let i = 0; i < this.arrayOfTurmas.length; i++) {
      for (let j = 0; j < this.arrayOfProfessores.length; j++) {
        let professorTurma = new ProfessorTurma();
        professorTurma.esc_id = this.esc_id;
        professorTurma.trm_id = this.arrayOfTurmas[i];
        professorTurma.prd_id = this.arrayOfProfessores[j];
        professorTurma.conselheiro = 0; //Depois pensar em mecanismo para definição de professor conselheiro.
        this.arrayOfProfessoresTurmas.push(professorTurma);
      }
    }
  }

  public inserir(): void {
    this.carregarProfessorTurma();
    this.feedbackUsuario = "Salvando dados, aguarde...";
    this.professorTurmaService.inserir(this.arrayOfProfessoresTurmas).toPromise().then((response: Response) => {
      this.limparDados();
      this.feedbackUsuario = undefined;
    }).catch((erro: Response) => {
      this.feedbackUsuario = undefined;
      //Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      //registra log de erro no firebase usando serviço singlenton
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
    //Gravar erros no analytics
    Utils.gravarErroAnalytics(JSON.stringify(erro));
      //Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
    })
  }

  public limparDados(): void {
    this.arrayOfProfessores.length = 0;
    this.arrayOfTurmas.length = 0;
    this.arrayOfProfessoresTurmas.length = 0;
    this.formulario.reset();
  }

  public listar(): void {
    this.router.navigate(["listar-professor"]);
  }

  public alertarChecksVazios() {
    if (
      this.arrayOfProfessores.length != 0 &&
      this.arrayOfTurmas.length != 0
    ) {
      this.exibirAlerta = false;
    }

    if (
      this.arrayOfProfessores.length == 0 ||
      this.arrayOfTurmas.length == 0
    ) {
      this.exibirAlerta = true;
    }
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
      this.professores = this.matrizReferencia;
    }
  }

  public limparFiltro(event: KeyboardEvent): void {
    if (event.key == 'Backspace' || event.key == 'Delete') {
      setTimeout(() => {
        this.professores = this.matrizReferencia
        this.feedbackUsuario = undefined;
        this.formulario.reset();
        this.arrayOfProfessores.length = 0;
        this.arrayOfTurmas.length = 0;
        this.filtrarProfessor(event);
      }, 50)
    }
  }


}
