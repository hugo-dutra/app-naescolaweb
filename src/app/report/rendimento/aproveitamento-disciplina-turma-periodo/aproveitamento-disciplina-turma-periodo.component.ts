import { Component, OnInit } from '@angular/core';
import { RendimentoService } from '../rendimento.service';
import { TurmaService } from '../../../crud/turma/turma.service';
import { PeriodoLetivoService } from '../../../crud/periodo-letivo/periodo-letivo.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Chart } from "chart.js";
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { Router } from '@angular/router';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-aproveitamento-disciplina-turma-periodo',
  templateUrl: './aproveitamento-disciplina-turma-periodo.component.html',
  styleUrls: ['./aproveitamento-disciplina-turma-periodo.component.scss'],
  providers: [RendimentoService, TurmaService, PeriodoLetivoService],
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
export class AproveitamentoDisciplinaTurmaPeriodoComponent implements OnInit {

  public arrayOfTurmas: Array<Object>;
  public arrayOfDadosAprovados: Array<Object>;
  public arrayOfDadosReprovados: Array<Object>;
  public arrayOfPeriodosLetivos: Array<Object>;
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public esc_id: number;
  public prl_id: number;
  public trm_id: number;
  public anoAtual: number;
  public valorMaximoGraficos: number = 0;

  public arrayOfLabelDisciplinasAprovados = new Array<string>();
  public arrayOfQuantidadeAprovados = new Array<number>();
  public arrayOfAprovadosColors = new Array<string>();
  public barChartAproveitamentoDisciplinaTurmaPeriodo: Chart;

  public arrayOfLabelDisciplinasReprovados = new Array<string>();
  public arrayOfQuantidadeReprovados = new Array<number>();
  public arrayOfReprovadosColors = new Array<string>();
  public barChartReprovadosDisciplinaTurmaPeriodo: Chart;

  constructor(private rendimentoService: RendimentoService,
    private turmaService: TurmaService,
    private periodoLetivoService: PeriodoLetivoService,
    private alertModalService: AlertModalService,
    private router: Router,
    private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.esc_id = parseInt(Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT));
    this.anoAtual = (new Date()).getFullYear();
    this.listarTurmas();
  }

  public listarTurmas(): void {
    this.feedbackUsuario = 'Listando turmas, aguarde...';
    this.turmaService.listarTodasAno(this.anoAtual, this.esc_id).toPromise().then((response: Response) => {
      this.arrayOfTurmas = Object.values(response);
      this.feedbackUsuario = undefined;
      this.listarPeriodosLetivos();
    }).catch((erro: Response) => {
      this.feedbackUsuario = undefined;
      //Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      //registra log de erro no firebase usando serviço singlenton
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
      //Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
    })
  }

  public listarPeriodosLetivos(): void {
    this.feedbackUsuario = 'Carregando periodos letivos, aguarde...';
    this.periodoLetivoService.listarPorAno(this.anoAtual).toPromise().then((response: Response) => {
      this.feedbackUsuario = undefined;
      this.arrayOfPeriodosLetivos = Object.values(response);

    }).catch((erro: Response) => {
      this.feedbackUsuario = undefined;
      //Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      //registra log de erro no firebase usando serviço singlenton
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
      //Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
    })
  }

  public selecionarTurma(event: Event): void {
    this.trm_id = parseInt((<HTMLInputElement>event.target).value);
  }

  public selecionarPeriodoLetivo(event: Event): void {
    this.prl_id = parseInt((<HTMLInputElement>event.target).value);
  }

  public verificarValorMaximoGraficos(): void {
    this.valorMaximoGraficos = 0;
    this.arrayOfDadosAprovados.forEach(valor => {
      if (parseInt(valor["quantidade"]) > this.valorMaximoGraficos) {
        this.valorMaximoGraficos = parseInt(valor["quantidade"]);
      }
    })
    this.arrayOfDadosReprovados.forEach(valor => {
      if (parseInt(valor["quantidade"]) > this.valorMaximoGraficos) {
        this.valorMaximoGraficos = parseInt(valor["quantidade"]);
      }
    })
    this.carregarArraysDadosGraficos();
  }

  public gerarGraficoAproveitamento(): void {
    this.feedbackUsuario = 'Carregando dados de estudantes acima da média...';
    this.rendimentoService.listarAproveitamentoDisciplinaTurmaPeriodo(this.trm_id, 5, this.prl_id, 'a')
      .toPromise()
      .then((response: Response) => {
        this.arrayOfDadosAprovados = Object.values(response);
        this.feedbackUsuario = 'Carregando dados de estudantes abaixo da média...';
        this.rendimentoService.listarAproveitamentoDisciplinaTurmaPeriodo(this.trm_id, 5, this.prl_id, 'r').toPromise().then((response: Response) => {
          this.feedbackUsuario = undefined;
          this.arrayOfDadosReprovados = Object.values(response);
          this.verificarValorMaximoGraficos();
        }).catch((erro: Response) => {
          this.feedbackUsuario = undefined;
          //Mostra modal
          this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
          //registra log de erro no firebase usando serviço singlenton
          this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
          //Caso token seja invalido, reenvia rota para login
          Utils.tratarErro({ router: this.router, response: erro });
        })
      }).catch((erro: Response) => {
        this.feedbackUsuario = undefined;
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
      })
  }

  public carregarArraysDadosGraficos(): void {
    this.feedbackUsuario = 'Construíndo gráfico...';
    this.arrayOfQuantidadeAprovados = [];
    this.arrayOfLabelDisciplinasAprovados = [];
    this.arrayOfAprovadosColors = [];

    this.arrayOfDadosAprovados.forEach((dado: Object) => {
      this.arrayOfQuantidadeAprovados.push(dado['quantidade']);
      this.arrayOfLabelDisciplinasAprovados.push(dado['disciplina']);
      this.arrayOfAprovadosColors.push("rgba(72, 133, 237, 0.75)");
    })

    this.arrayOfQuantidadeReprovados = [];
    this.arrayOfLabelDisciplinasReprovados = [];
    this.arrayOfReprovadosColors = [];

    this.arrayOfDadosReprovados.forEach((dado: Object) => {
      this.arrayOfQuantidadeReprovados.push(dado['quantidade']);
      this.arrayOfLabelDisciplinasReprovados.push(dado['disciplina']);
      this.arrayOfReprovadosColors.push("rgba(219,68,55, 0.75)");
    })

    this.feedbackUsuario = undefined;
    this.atualizarChartAproveitamentoAcimaDaMedia();
    this.atualizarChartAproveitamentoAbaixoDaMedia();
  }

  public atualizarChartAproveitamentoAcimaDaMedia(): void {
    let context = (<HTMLCanvasElement>document.getElementById('barChartAproveitamentoTurmaDisciplinaPeriodo')).getContext('2d');
    if (this.barChartAproveitamentoDisciplinaTurmaPeriodo != undefined)
      this.barChartAproveitamentoDisciplinaTurmaPeriodo.destroy();

    this.barChartAproveitamentoDisciplinaTurmaPeriodo = new Chart(context, {
      type: "bar",
      data: {
        labels: this.arrayOfLabelDisciplinasAprovados,
        datasets: [
          {
            label: "",
            data: this.arrayOfQuantidadeAprovados,
            lineTension: 0.2,
            backgroundColor: this.arrayOfAprovadosColors,
            borderWidth: 2
          },
        ]
      },
      options: {
        legend: { display: false },
        title: { text: "Estudantes acima da média", fontSize: 20, position: "top", display: true },
        responsive: true,
        scales: {
          yAxes: [
            {
              ticks: {
                min: 0,
                max: this.valorMaximoGraficos,
              }
            }
          ]
        },
        maintainAspectRatio: false,
        animation: {
          duration: 500,
          easing: "easeInQuart",
        },
        tooltips: {
          backgroundColor: "rgba(72, 133, 237, 0.75)",
          borderColor: "rgb(255,255,255)",
          borderWidth: 2,
          bodyFontSize: 30,
          callbacks: {
            labelTextColor: function (tooltipItem, chart) {
              return "rgb(255,255, 255)";
            },
          }
        }
      }
    });
  }

  public atualizarChartAproveitamentoAbaixoDaMedia(): void {
    let context = (<HTMLCanvasElement>document.getElementById('barChartSemAproveitamentoTurmaDisciplinaPeriodo')).getContext('2d');
    if (this.barChartReprovadosDisciplinaTurmaPeriodo != undefined)
      this.barChartReprovadosDisciplinaTurmaPeriodo.destroy();

    this.barChartReprovadosDisciplinaTurmaPeriodo = new Chart(context, {
      type: "bar",
      data: {

        labels: this.arrayOfLabelDisciplinasReprovados,
        datasets: [
          {
            label: "",
            data: this.arrayOfQuantidadeReprovados,
            lineTension: 0.2,
            backgroundColor: this.arrayOfReprovadosColors,
            borderWidth: 2
          },
        ]
      },
      options: {
        title: { text: "Estudantes abaixo da média", fontSize: 20, position: "bottom", display: true },
        legend: { display: false },
        responsive: true,
        scales: {
          yAxes: [
            {
              ticks: {
                min: 0,
                reverse: true,
                max: this.valorMaximoGraficos,
              }
            }
          ]
        },
        maintainAspectRatio: false,
        animation: {
          duration: 500,
          easing: "easeInQuart",
        },
        tooltips: {
          backgroundColor: "rgba(72, 133, 237, 0.75)",
          borderColor: "rgb(255,255,255)",
          borderWidth: 2,
          bodyFontSize: 30,
          callbacks: {
            labelTextColor: function (tooltipItem, chart) {
              return "rgb(255,255, 255)";
            },
          }
        }
      }
    });
  }


}
