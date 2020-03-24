import { EstudanteService } from './../../estudante/estudante.service';
import { ProfessorDisciplinaService } from './../../professor-disciplina/professor-disciplina.service';
import { ProfessorService } from './../../professor/professor.service';
import { Router } from '@angular/router';
import { FirebaseService } from './../../../shared/firebase/firebase.service';
import { AlertModalService } from './../../../shared-module/alert-modal.service';
import { TurmaService } from './../../turma/turma.service';
import { TurnoService } from './../../turno/turno.service';
import { Component, OnInit } from '@angular/core';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Utils } from '../../../shared/utils.shared';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'ngx-inserir-atividade',
  templateUrl: './inserir-atividade.component.html',
  styleUrls: ['./inserir-atividade.component.scss'],
  providers: [ProfessorDisciplinaService, TurnoService, TurmaService, EstudanteService],
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
export class InserirAtividadeComponent implements OnInit {

  public feedbackUsuario: string;
  public estado: string = 'visivel';
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;


  public escId: number;
  public usrId: number;
  public anoAtual: number;
  public trnId: number;
  public tituloAtividade: string = '';
  public instrucoesAtividade: string = '';
  public arrayDeTurnos = new Array<Object>();
  public arrayDeProfessorDisciplina = new Array<Object>();
  public arrayDeTurmas = new Array<Object>();
  public arrayDeTurmasSelecionadas = new Array<Object>();
  public arrayDeEstudantes = new Array<Object>();
  public arrayDeEstudantesSelecionados = new Array<Object>();

  constructor(
    private professorDisciplinaService: ProfessorDisciplinaService,
    private turnoService: TurnoService,
    private turmaService: TurmaService,
    private estudanteService: EstudanteService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.carregarDados();
    this.carregarListagens();
  }

  public carregarDados(): void {
    this.escId = Utils.pegarDadosEscolaDetalhado().id;
    this.usrId = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados'), CONSTANTES.PASSO_CRIPT))[0].id;
    this.anoAtual = (new Date()).getFullYear();
  }

  public carregarListagens(): void {
    this.feedbackUsuario = 'Carregando dados, aguarde...';
    this.listarTurnos().then(() => {
      this.listarProfessorDisciplina().then(() => {
        this.feedbackUsuario = undefined;
      });
    }).catch((erro: Response) => {
      this.tratarErro(erro);
    });
  }

  public listarTurmas(): void {
    this.feedbackUsuario = 'Carregando turmas, aguarde...';
    this.turmaService.listarTurnoId(this.trnId, this.escId, this.anoAtual).toPromise().then((response: Response) => {
      this.arrayDeTurmas = Object.values(response);
      this.feedbackUsuario = undefined;
    }).catch((erro: Response) => {
      this.tratarErro(erro);
    });
  }

  public listarProfessorDisciplina(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.professorDisciplinaService.listarDisciplina(this.escId, true).toPromise().then((response: Response) => {
        this.arrayDeProfessorDisciplina = Object.values(response);
        resolve('ok');
      }).catch((erro: Response) => {
        reject(erro);
      });
    });
  }

  public listarTurnos(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.turnoService.listar(this.escId).toPromise().then((response: Response) => {
        this.arrayDeTurnos = Object.values(response);
        resolve('ok');
      }).catch((erro: Response) => {
        reject(erro);
      });
    });
  }

  public selecionarTurno(): void {
    this.feedbackUsuario = 'Carregando turmas, aguarde...';
    this.turmaService.listarTurnoId(this.trnId, this.escId, this.anoAtual).toPromise().then((response: Response) => {
      this.arrayDeTurmas = Object.values(response);
      this.arrayDeTurmasSelecionadas = [];
      (<HTMLInputElement>document.getElementById('selecionar_todas_turmas')).checked = false;
      this.feedbackUsuario = undefined;
    }).catch((erro: Response) => {
      this.tratarErro(erro);
    });
  }

  public selecionarTodasTurmas(event: Event): void {
    const status = (<HTMLInputElement>event.target).checked;
    const checkTurmas = document.getElementsByClassName('turmas_disponiveis');
    if (status) {
      this.arrayDeTurmasSelecionadas = this.arrayDeTurmas.map((valor) => {
        return valor['id'];
      });
      Array.from(checkTurmas).forEach(turma => {
        (<HTMLInputElement>turma).checked = true;
      });
    } else {
      this.arrayDeTurmasSelecionadas = [];
      Array.from(checkTurmas).forEach(turma => {
        (<HTMLInputElement>turma).checked = false;
      });
    }
  }

  public selecionarTodosEstudantes(event: Event): void {
    const status = (<HTMLInputElement>event.target).checked;
    const checkEstudantes = document.getElementsByClassName('estudantes_disponiveis');
    if (status) {
      this.arrayDeEstudantesSelecionados = this.arrayDeEstudantes.map((valor) => {
        return valor;
      });
      Array.from(checkEstudantes).forEach(estudante => {
        (<HTMLInputElement>estudante).checked = true;
      });
    } else {
      this.arrayDeEstudantesSelecionados = [];
      Array.from(checkEstudantes).forEach(estudante => {
        (<HTMLInputElement>estudante).checked = false;
      });
    }
  }

  public listarEstudantesTurmaSelecionada(event: Event): void {
    const trmIdSelecionada = parseInt((<HTMLInputElement>event.target).value, 10);
    const adicionarEstudantes = (<HTMLInputElement>event.target).checked;
    if (adicionarEstudantes) {
      this.feedbackUsuario = 'Adicionando estudantes...';
      this.estudanteService.listarTurmaId(trmIdSelecionada).toPromise().then((response: Response) => {
        Object.values(response).forEach((valor) => {
          this.arrayDeEstudantes.push(valor);
        });
        this.feedbackUsuario = undefined;
      }).catch((erro: Response) => {
        this.tratarErro(erro);
      });
    } else {
      this.arrayDeEstudantes = this.arrayDeEstudantes.filter((valor) => {
        return valor['trm_id'] !== trmIdSelecionada;
      });
    }
  }

  public adicionarEstudantes(event: Event): void {
    const estIdSelecionado = parseInt((<HTMLInputElement>event.target).value, 10);
    const selecionarEstudantes = (<HTMLInputElement>event.target).checked;
    if (selecionarEstudantes) {
      this.arrayDeEstudantes.forEach((estudante) => {
        if (estudante['id'] === estIdSelecionado) {
          this.arrayDeEstudantesSelecionados.push(estudante);
        }
      });
    } else {
      this.arrayDeEstudantesSelecionados = this.arrayDeEstudantesSelecionados.filter((estudante) => {
        return estudante['id'] !== estIdSelecionado ? estudante : null;
      });
    }
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
