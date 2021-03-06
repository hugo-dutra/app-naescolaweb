import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { ProfessorDisciplinaService } from '../../../crud/professor-disciplina/professor-disciplina.service';
import { RendimentoService } from '../rendimento.service';
import { PeriodoLetivoService } from '../../../crud/periodo-letivo/periodo-letivo.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { Router } from '@angular/router';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-aproveitamento-professor-disciplina-periodo',
  templateUrl: './aproveitamento-professor-disciplina-periodo.component.html',
  styleUrls: ['./aproveitamento-professor-disciplina-periodo.component.scss'],
  providers: [ProfessorDisciplinaService, RendimentoService, PeriodoLetivoService],
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
export class AproveitamentoProfessorDisciplinaPeriodoComponent implements OnInit {

  public arrayOfProfessoresDisciplinas: Array<Object>;
  public arrayOfDadosAprovados: Array<Object>;
  public arrayOfDadosReprovados: Array<Object>;
  public arrayOfPeriodosLetivos: Array<Object>;
  public feedbackUsuario: string;
  public estado: string = 'visivel';
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public esc_id: number;
  public prl_id: number;
  public prd_id: number;
  public anoAtual: number;
  public valorMaximoGraficos: number = 0;

  public arrayOfLabelDisciplinasAprovados = new Array<string>();
  public arrayOfQuantidadeAprovados = new Array<number>();
  public arrayOfAprovadosColors = new Array<string>();
  public barChartAproveitamentoProfessorDisciplinaPeriodo: Chart;

  public arrayOfLabelDisciplinasReprovados = new Array<string>();
  public arrayOfQuantidadeReprovados = new Array<number>();
  public arrayOfReprovadosColors = new Array<string>();
  public barChartReprovadosProfessorDisciplinaPeriodo: Chart;

  constructor(
    private periodoLetivoService: PeriodoLetivoService,
    private alertModalService: AlertModalService,
    private router: Router,
    private firebaseService: FirebaseService,
    private professorDisciplinaService: ProfessorDisciplinaService,
    private rendimentoService: RendimentoService,
  ) { }

  ngOnInit() {
    this.esc_id = parseInt(Utils.decriptAtoB(localStorage.getItem('esc_id'), CONSTANTES.PASSO_CRIPT), 10);
    this.anoAtual = (new Date()).getFullYear();
    this.listarPeriodosLetivos();
  }

  public verificarValorMaximoGraficos(): void {
    this.valorMaximoGraficos = 0;
    this.arrayOfDadosAprovados.forEach(valor => {
      if (parseInt(valor['quantidade'], 10) > this.valorMaximoGraficos) {
        this.valorMaximoGraficos = parseInt(valor['quantidade'], 10);
      }
    });
    this.arrayOfDadosReprovados.forEach(valor => {
      if (parseInt(valor['quantidade'], 10) > this.valorMaximoGraficos) {
        this.valorMaximoGraficos = parseInt(valor['quantidade'], 10);
      }
    });
    this.carregarArraysDadosGraficos();
  }

  public listarPeriodosLetivos() {
    this.feedbackUsuario = 'Listando periodos letivos';
    this.periodoLetivoService.listarPorAno(this.anoAtual).toPromise().then((response: Response) => {
      this.arrayOfPeriodosLetivos = Object.values(response);
      this.listarProfessoresDisciplinas();
    }).catch((erro: Response) => {
      this.tratarErro(erro);
    });
  }

  public listarProfessoresDisciplinas(): void {
    this.feedbackUsuario = 'Listando professores e disciplinas, aguarde...';
    this.professorDisciplinaService.listarDisciplina(this.esc_id, true).toPromise().then((response: Response) => {
      this.feedbackUsuario = undefined;
      this.arrayOfProfessoresDisciplinas = Object.values(response);
    }).catch((erro: Response) => {
      this.tratarErro(erro);
    });
  }

  public selecionarProfessorDisciplina(event: Event): void {
    this.prd_id = parseInt((<HTMLInputElement>event.target).value, 10);
  }

  public selecionarPeriodoLetivo(event: Event): void {
    this.prl_id = parseInt((<HTMLInputElement>event.target).value, 10);
  }

  public gerarGraficoAproveitamento(): void {
    this.feedbackUsuario = 'Carregando dados dos estudantes acima da m??dia...';
    this.rendimentoService.listarAproveitamentoProfessorDisciplinaPeriodo(5, this.prd_id, this.prl_id, 'a')
      .toPromise().then((response: Response) => {
        this.arrayOfDadosAprovados = Object.values(response);
        this.feedbackUsuario = 'Carregando dados dos estudantes abaixo da m??dia...';
        this.rendimentoService.listarAproveitamentoProfessorDisciplinaPeriodo(5, this.prd_id, this.prl_id, 'r')
          // tslint:disable-next-line: no-shadowed-variable
          .toPromise().then((response: Response) => {
            this.arrayOfDadosReprovados = Object.values(response);
            this.feedbackUsuario = undefined;
            this.carregarArraysDadosGraficos();
            this.verificarValorMaximoGraficos();
          }).catch((erro: Response) => {
            this.tratarErro(erro);
          }).catch((erro: Response) => {
            this.tratarErro(erro);
          });
      });
  }



  public carregarArraysDadosGraficos(): void {
    this.feedbackUsuario = 'Constru??ndo gr??fico...';
    this.arrayOfQuantidadeAprovados = [];
    this.arrayOfLabelDisciplinasAprovados = [];
    this.arrayOfAprovadosColors = [];

    this.arrayOfDadosAprovados.forEach((dado: Object) => {
      this.arrayOfQuantidadeAprovados.push(dado['quantidade']);
      this.arrayOfLabelDisciplinasAprovados.push(`${dado['serie']}-${dado['turma']}`);
      this.arrayOfAprovadosColors.push('rgba(72, 133, 237, 0.75)');
    });

    this.arrayOfQuantidadeReprovados = [];
    this.arrayOfLabelDisciplinasReprovados = [];
    this.arrayOfReprovadosColors = [];

    this.arrayOfDadosReprovados.forEach((dado: Object) => {
      this.arrayOfQuantidadeReprovados.push(dado['quantidade']);
      this.arrayOfLabelDisciplinasReprovados.push(`${dado['serie']}-${dado['turma']}`);
      this.arrayOfReprovadosColors.push('rgba(219,68,55, 0.75)');
    });

    this.feedbackUsuario = undefined;
    this.atualizarChartAproveitamentoAcimaDaMedia();
    this.atualizarChartAproveitamentoAbaixoDaMedia();
  }

  public atualizarChartAproveitamentoAcimaDaMedia(): void {
    const context = (<HTMLCanvasElement>document.getElementById('barChartAproveitamentoProfessorDisciplinaPeriodo'))
      .getContext('2d');
    if (this.barChartAproveitamentoProfessorDisciplinaPeriodo != undefined)
      this.barChartAproveitamentoProfessorDisciplinaPeriodo.destroy();

    this.barChartAproveitamentoProfessorDisciplinaPeriodo = new Chart(context, {
      type: 'bar',
      data: {
        labels: this.arrayOfLabelDisciplinasAprovados,
        datasets: [
          {
            label: '',
            data: this.arrayOfQuantidadeAprovados,
            lineTension: 0.2,
            backgroundColor: this.arrayOfAprovadosColors,
            borderWidth: 2,
          },
        ],
      },
      options: {
        legend: { display: false },
        title: { text: 'Estudantes acima da m??dia', fontSize: 20, position: 'top', display: true },
        responsive: true,
        scales: {
          yAxes: [
            {
              ticks: {
                min: 0,
                max: this.valorMaximoGraficos,
              },
            },
          ],
        },
        maintainAspectRatio: false,
        animation: {
          duration: 500,
          easing: 'easeInQuart',
        },
        tooltips: {
          backgroundColor: 'rgba(72, 133, 237, 0.75)',
          borderColor: 'rgb(255,255,255)',
          borderWidth: 2,
          bodyFontSize: 30,
          callbacks: {
            labelTextColor: function (tooltipItem, chart) {
              return 'rgb(255,255, 255)';
            },
          },
        },
      },
    });
  }

  public atualizarChartAproveitamentoAbaixoDaMedia(): void {
    const context = (<HTMLCanvasElement>document.getElementById('barChartSemAproveitamentoProfessorDisciplinaPeriodo'))
      .getContext('2d');
    if (this.barChartReprovadosProfessorDisciplinaPeriodo != undefined)
      this.barChartReprovadosProfessorDisciplinaPeriodo.destroy();

    this.barChartReprovadosProfessorDisciplinaPeriodo = new Chart(context, {
      type: 'bar',
      data: {

        labels: this.arrayOfLabelDisciplinasReprovados,
        datasets: [
          {
            label: '',
            data: this.arrayOfQuantidadeReprovados,
            lineTension: 0.2,
            backgroundColor: this.arrayOfReprovadosColors,
            borderWidth: 2,
          },
        ],
      },
      options: {
        title: { text: 'Estudantes abaixo da m??dia', fontSize: 20, position: 'bottom', display: true },
        legend: { display: false },
        responsive: true,
        scales: {
          yAxes: [
            {
              ticks: {
                min: 0,
                reverse: true,
                max: this.valorMaximoGraficos,
              },
            },
          ],
        },
        maintainAspectRatio: false,
        animation: {
          duration: 500,
          easing: 'easeInQuart',
        },
        tooltips: {
          backgroundColor: 'rgba(72, 133, 237, 0.75)',
          borderColor: 'rgb(255,255,255)',
          borderWidth: 2,
          bodyFontSize: 30,
          callbacks: {
            labelTextColor: function (tooltipItem, chart) {
              return 'rgb(255,255, 255)';
            },
          },
        },
      },
    });
  }

  public tratarErro(erro: Response): void {
    this.feedbackUsuario = undefined;
    // Mostra modal
    this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
    // registra log de erro no firebase usando servi??o singlenton
    this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`,
      JSON.stringify(erro));
    // Gravar erros no analytics
    Utils.gravarErroAnalytics(JSON.stringify(erro));
    // Caso token seja invalido, reenvia rota para login
    Utils.tratarErro({ router: this.router, response: erro });
  }

}
