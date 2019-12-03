import { Component, OnInit } from '@angular/core';
import { Chart } from "chart.js";
import { RendimentoService } from '../rendimento.service';
import { TurmaService } from '../../../crud/turma/turma.service';
import { PeriodoLetivoService } from '../../../crud/periodo-letivo/periodo-letivo.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { ResultadoEstudante, NotaFaltasDisciplinaEstudante } from '../resultado-estudante.model';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-rendimento-resumo-periodo-letivo',
  templateUrl: './rendimento-resumo-periodo-letivo.component.html',
  styleUrls: ['./rendimento-resumo-periodo-letivo.component.scss'],
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
export class RendimentoResumoPeriodoLetivoComponent implements OnInit {

  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public resultadosEstudantes = new Array<ResultadoEstudante>();
  public estudanteSelecionado = new ResultadoEstudante;
  public turmas: Object[];
  public periodosLetivos: Object[];

  public barChartnotaFaltasPeriodo: Chart;
  public arrayOfDadosNotaPeriodo = new Array<number>();
  public arrayOfDadosFaltasPeriodo = new Array<number>();
  public arrayOfLabelsNotaPeriodo = new Array<string>();
  public arrayOfColors = new Array<string>();
  public arrayOfFaltasColors = new Array<string>();
  public notaDeCorte: number = 5;
  public stringTurmaSelecionada: string = "Selecione uma turma";
  public stringPeriodoSelecionado: string = "Selecione um periodo";
  public esc_id: number;
  public dados_escola = new Array<Object>();
  public anoAtual: number;
  public tipoGraficoSelecionado = 0;
  public trm_id_selecionada: number = 0;
  public prl_id_selecionado: number = 0;
  public usr_id: number;

  constructor(
    private rendimentoService: RendimentoService,
    private turmaService: TurmaService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private periodoLetivoService: PeriodoLetivoService,
    private router: Router
  ) { }

  ngOnInit() {
    this.dados_escola = JSON.parse(Utils.decriptAtoB(localStorage.getItem("dados_escola"), CONSTANTES.PASSO_CRIPT))[0];
    this.esc_id = parseInt(this.dados_escola["id"]);
    this.anoAtual = (new Date()).getFullYear();
    this.carregarTurmas();
  }

  public carregarPeriodoLetivo(): void {
    this.feedbackUsuario = "Listando períodos letivos";
    this.periodoLetivoService.listarPorAno(this.anoAtual).toPromise().then((response: Response) => {
      this.periodosLetivos = Object.values(response);
      this.feedbackUsuario = undefined;
    })
  }

  public selecionarPeriodo(event: Event): void {
    this.prl_id_selecionado = parseInt((<HTMLInputElement>event.target).id);
    this.stringPeriodoSelecionado = (<HTMLInputElement>event.target).name;
    if (this.trm_id_selecionada != 0 && this.prl_id_selecionado != 0) {
      this.feedbackUsuario = "Carregando estudantes, aguarde...";
      this.carregarResultadosTurma();
    } else {
      this.arrayOfLabelsNotaPeriodo = [];
      this.arrayOfDadosNotaPeriodo = [];
      this.arrayOfDadosFaltasPeriodo = [];
      this.arrayOfColors = [];
    }
  }

  public selecionarTurma(event: Event): void {
    this.trm_id_selecionada = parseInt((<HTMLInputElement>event.target).id);
    this.stringTurmaSelecionada = (<HTMLInputElement>event.target).name;
    if (this.trm_id_selecionada != 0 && this.prl_id_selecionado != 0) {
      this.feedbackUsuario = "Carregando estudantes, aguarde...";
      this.carregarResultadosTurma();
    } else {
      this.arrayOfLabelsNotaPeriodo = [];
      this.arrayOfDadosNotaPeriodo = [];
      this.arrayOfDadosFaltasPeriodo = [];
      this.arrayOfColors = [];
    }
  }

  public carregarTurmas(): void {
    this.feedbackUsuario = "Carregando turmas, aguarde...";
    this.turmaService.listarTodasAno(this.anoAtual, this.esc_id).toPromise().then((response: Response) => {
      this.turmas = Object.values(response);
      this.carregarPeriodoLetivo();
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

  public atualizarChartNotaFaltasPeriodo(): void {
    let context = (<HTMLCanvasElement>document.getElementById('barChartnotaFaltasPeriodo')).getContext('2d');
    if (this.barChartnotaFaltasPeriodo != undefined)
      this.barChartnotaFaltasPeriodo.destroy();

    this.barChartnotaFaltasPeriodo = new Chart(context, {
      type: "bar",
      data: {
        labels: this.arrayOfLabelsNotaPeriodo,
        datasets: [
          {
            label: "",
            yAxisID: "notas",
            data: this.arrayOfDadosNotaPeriodo,
            lineTension: 0.2,
            backgroundColor: this.arrayOfColors,
            borderColor: ["rgba(255, 159, 64, 0.5)"],
            borderWidth: 2
          },
          {
            label: "",
            yAxisID: "faltas",
            data: this.arrayOfDadosFaltasPeriodo,
            lineTension: 0.1,
            backgroundColor: this.arrayOfFaltasColors,
            borderColor: ["rgba(255, 159, 64, 0.5)"],
            borderWidth: 1
          }
        ]
      },
      options: {
        legend: { display: false },
        title: { text: "Aproveitamento e faltas", fontSize: 20, position: "top", display: true },
        responsive: true,
        scales: {
          yAxes: [
            {
              id: "notas",
              ticks: {
                beginAtZero: true,
                max: 10,
              },
              position: "left",
              type: "linear",
            },
            {
              id: "faltas",
              ticks: {
                beginAtZero: true,
              },
              position: "right",
              type: "linear",
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

  public atualizarChartNotaPeriodo(): void {
    let context = (<HTMLCanvasElement>document.getElementById('barChartnotaFaltasPeriodo')).getContext('2d');
    if (this.barChartnotaFaltasPeriodo != undefined)
      this.barChartnotaFaltasPeriodo.destroy();

    this.barChartnotaFaltasPeriodo = new Chart(context, {
      type: "bar",
      data: {
        labels: this.arrayOfLabelsNotaPeriodo,
        datasets: [
          {
            label: "",
            yAxisID: "notas",
            data: this.arrayOfDadosNotaPeriodo,
            lineTension: 0.2,
            backgroundColor: this.arrayOfColors,
            borderColor: ["rgba(255, 159, 64, 0.5)"],
            borderWidth: 2
          },
        ]
      },
      options: {
        legend: { display: false },
        title: { text: "Aproveitamento", fontSize: 20, position: "top", display: true },
        responsive: true,
        scales: {
          yAxes: [
            {
              id: "notas",
              ticks: {
                beginAtZero: true,
                max: 10,
              },
              position: "left",
              type: "linear",
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

  public atualizarChartFaltasPeriodo(): void {
    let context = (<HTMLCanvasElement>document.getElementById('barChartnotaFaltasPeriodo')).getContext('2d');
    if (this.barChartnotaFaltasPeriodo != undefined)
      this.barChartnotaFaltasPeriodo.destroy();

    this.barChartnotaFaltasPeriodo = new Chart(context, {
      type: "bar",
      data: {
        labels: this.arrayOfLabelsNotaPeriodo,
        datasets: [
          {
            label: "Faltas",
            yAxisID: "faltas",
            data: this.arrayOfDadosFaltasPeriodo,
            lineTension: 0.1,
            backgroundColor: this.arrayOfFaltasColors,
            borderColor: ["rgba(255, 159, 64, 0.5)"],
            borderWidth: 1
          }
        ]
      },
      options: {
        legend: { display: false },
        title: { text: "Faltas", fontSize: 20, position: "top", display: true },
        responsive: true,
        scales: {
          yAxes: [
            {
              id: "faltas",
              ticks: {
                beginAtZero: true,
              },
              position: "right",
              type: "linear",
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

  public carregarResultadosTurma(): void {
    this.feedbackUsuario = "Carregando notas dos estudantes, aguarde...";
    this.resultadosEstudantes = []
    this.rendimentoService.listarRendimentoTurmaPeriodo(this.trm_id_selecionada, this.prl_id_selecionado).toPromise().then((response: Response) => {
      let resultados_turma = Object.values(response);
      let last_est_id: number = 0;
      let resultadoEstudante: ResultadoEstudante;
      if (resultados_turma.length == 0) {
        this.barChartnotaFaltasPeriodo.destroy();
        this.estudanteSelecionado.estudante = "";
      }
      resultados_turma.forEach(resultado => {
        let est_id: number = resultado["est_id"];
        if (est_id != last_est_id) {
          last_est_id = est_id;
          resultadoEstudante = new ResultadoEstudante();
          resultadoEstudante.est_id = last_est_id;
          resultadoEstudante.estudante = resultado["nome"];
          if (resultado["foto"] != "") {
            resultadoEstudante.foto = resultado["foto"];
          } else {
            resultadoEstudante.foto = "../../../../assets/images/noavatar.jpg";
          }
          this.resultadosEstudantes.push(resultadoEstudante);
        }
        if (est_id == last_est_id) {
          let notaFaltasDisciplinaEstudante = new NotaFaltasDisciplinaEstudante();
          notaFaltasDisciplinaEstudante.nota = resultado["nota"];
          notaFaltasDisciplinaEstudante.faltas = resultado["faltas"];
          notaFaltasDisciplinaEstudante.descricao = resultado["disciplina"];
          notaFaltasDisciplinaEstudante.descricao_abv = resultado["disciplina_abv"];
          resultadoEstudante.notaFaltasdisciplinas.push(notaFaltasDisciplinaEstudante);
        }
      })
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

  public selecionarEstudante(resultadoEstudante: ResultadoEstudante): void {
    this.estudanteSelecionado = resultadoEstudante;
    this.arrayOfLabelsNotaPeriodo = [];
    this.arrayOfDadosNotaPeriodo = [];
    this.arrayOfDadosFaltasPeriodo = [];
    this.arrayOfColors = [];
    this.estudanteSelecionado.notaFaltasdisciplinas.forEach(resultado => {
      this.arrayOfLabelsNotaPeriodo.push(resultado["descricao_abv"]);
      this.arrayOfDadosNotaPeriodo.push(resultado["nota"]);
      this.arrayOfDadosFaltasPeriodo.push(resultado["faltas"]);
      this.arrayOfFaltasColors.push("rgba( 72, 133, 237,0.75)");
      if (resultado["nota"] < this.notaDeCorte - 0.5) {
        this.arrayOfColors.push("rgba(219, 50, 54,0.75)");
      } else if (resultado["nota"] < this.notaDeCorte) {
        this.arrayOfColors.push("rgba(244, 194, 13,0.75)");
      } else {
        this.arrayOfColors.push("rgba(60, 186, 84,0.75)");
      }
    })

    switch (this.tipoGraficoSelecionado) {
      case 0: {
        this.atualizarChartNotaPeriodo();
        break;
      }
      case 1: {
        this.atualizarChartFaltasPeriodo();
        break;
      }
      case 2: {
        this.atualizarChartNotaFaltasPeriodo();
        break;
      }
      default:
        break;
    }
  }

  public selecionarTipoGrafico(tipoGrafico: number): void {
    this.tipoGraficoSelecionado = tipoGrafico;
    switch (this.tipoGraficoSelecionado) {
      case 0: {
        this.atualizarChartNotaPeriodo();
        break;
      }
      case 1: {
        this.atualizarChartFaltasPeriodo();
        break;
      }
      case 2: {
        this.atualizarChartNotaFaltasPeriodo();
        break;
      }
      default:
        break;
    }
  }

}
