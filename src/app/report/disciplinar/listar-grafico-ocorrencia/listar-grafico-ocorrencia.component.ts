import { Component, OnInit } from '@angular/core';
import { DisciplinarService } from '../disciplinar.service';
import { TurmaService } from '../../../crud/turma/turma.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Chart } from "chart.js";
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { Router } from '@angular/router';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-listar-grafico-ocorrencia',
  templateUrl: './listar-grafico-ocorrencia.component.html',
  styleUrls: ['./listar-grafico-ocorrencia.component.scss'],
  providers: [DisciplinarService, TurmaService],
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
export class ListarGraficoOcorrenciaComponent implements OnInit {

  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public turmas: Object;
  public data_inicio_padrao: string;
  public data_fim_padrao: string;

  public trm_id: number;
  public quantidadeOcorrenciasPeriodo = new Object();
  public quantidadeOcorrenciasTurmaPeriodo = new Object();
  public quantidadeOcorrenciasEstudantePeriodo = new Object();
  public quantidadeTipoOcorrenciasPeriodo = new Object();

  public arrayOfLabelsOcorrenciasPeriodo = new Array<string>();
  public arrayOfLabelsOcorrenciasTurmaPeriodo = new Array<string>();
  public arrayOfLabelsOcorrenciasEstudantePeriodo = new Array<string>();
  public arrayOfLabelsTipoOcorrenciasPeriodo = new Array<string>();

  public arrayOfCoresOcorrenciasTurmaPeriodo = new Array<string>();
  public arrayOfCoresOcorrenciasEstudantePeriodo = new Array<string>();
  public arrayOfCoresTipoOcorrenciasPeriodo = new Array<string>();

  public arrayOfDadosOcorrenciasPeriodo = new Array<number>();
  public arrayOfDadosOcorrenciasTurmaPeriodo = new Array<number>();
  public arrayOfDadosOcorrenciasEstudantePeriodo = new Array<number>();
  public arrayOfDadosTipoOcorrenciasPeriodo = new Array<number>();

  public dataInicioQuantidadeOcorrencias: string;
  public dataInicioQuantidadeOcorrenciasTurma: string;
  public dataInicioQuantidadeOcorrenciasEstudante: string;
  public dataInicioQuantidadeTipoOcorrencias: string;

  public dataFimQuantidadeOcorrencias: string;
  public dataFimQuantidadeOcorrenciasTurma: string;
  public dataFimQuantidadeOcorrenciasEstudante: string;
  public dataFimQuantidadeTipoOcorrencias: string;

  public lineChartOcorrenciaPeriodo: Chart;
  public lineChartOcorrenciaTurmaPeriodo: Chart;
  public lineChartOcorrenciaEstudantePeriodo: Chart;
  public lineChartTipoOcorrenciaPeriodo: Chart;

  constructor(
    private disciplinarService: DisciplinarService,
    private alertModalService: AlertModalService,
    private router: Router,
    private firebaseService: FirebaseService,
    private turmaService: TurmaService
  ) { }

  ngOnInit() {
    this.listarTurma();
    this.inicializarDatas();
  }

  public inicializarDatas(): void {
    this.data_inicio_padrao = new Date().getFullYear().toString() + "-01-01";
    this.data_fim_padrao =
      new Date().getFullYear().toString() +
      "-" +
      ("0" + (new Date().getMonth() + 1)).slice(-2).toString() +
      "-" +
      ("0" + new Date().getDate()).slice(-2).toString();

    this.dataInicioQuantidadeOcorrencias = this.data_inicio_padrao;
    this.dataFimQuantidadeOcorrencias = this.data_fim_padrao;

    this.dataInicioQuantidadeOcorrenciasTurma = this.data_inicio_padrao;
    this.dataFimQuantidadeOcorrenciasTurma = this.data_fim_padrao;

    this.dataInicioQuantidadeOcorrenciasEstudante = this.data_inicio_padrao;
    this.dataFimQuantidadeOcorrenciasEstudante = this.data_fim_padrao;

    this.dataInicioQuantidadeTipoOcorrencias = this.data_inicio_padrao;
    this.dataFimQuantidadeTipoOcorrencias = this.data_fim_padrao;

    this.pesquisarQuantidadeOcorrenciaPeriodo();
  }

  public mostrarOcorrenciasPorTurma(): void {
    this.pesquisarQuantidadeOcorrenciaTurma();
  }

  //***********************************QUANTIDADE DE OCORRÊNCIAS POR PERÍODO************************************/
  public chartHistoricoQuantidadeOcorrencias(): void {
    this.lineChartOcorrenciaPeriodo = new Chart("lineChartOcorrenciaPeriodo", {
      type: "line",
      data: {
        labels: this.arrayOfLabelsOcorrenciasPeriodo,
        datasets: [
          {
            label: "Quantidade de ocorrências por dia",
            data: this.arrayOfDadosOcorrenciasPeriodo,
            lineTension: 0.2,
            backgroundColor: ["rgba(219, 50, 54,0.5)"],
            borderColor: ["rgba(255, 159, 64, 0.5)"],
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        },
        maintainAspectRatio: false,
        animation: {
          duration: 250,
          easing: "easeInQuart"
        },
        tooltips: {
          backgroundColor: "rgba(72, 133, 237, 0.75)",
          borderColor: "rgb(255,255,255)",
          borderWidth: 2,
          callbacks: {
            labelColor: function (tooltipItem, chart) {
              return {
                borderColor: "rgb(0, 0, 0)",
                backgroundColor: "rgb(0, 0, 0)"
              };
            },
            labelTextColor: function (tooltipItem, chart) {
              return "rgb(255,255, 255)";
            }
          }
        }
      }
    });
  }

  public gravarDataInicio(event: Event): void {
    this.dataInicioQuantidadeOcorrencias = (<HTMLInputElement>(
      event.target
    )).value;
  }

  public gravarDataFim(event: Event): void {
    this.dataFimQuantidadeOcorrencias = (<HTMLInputElement>event.target).value;
  }

  public pesquisarQuantidadeOcorrenciaPeriodo(): void {
    this.listarQuantidadeOcorrenciaPeriodo();
  }

  public limparChartOcorrenciaPeriodo(): void {
    document.getElementById("chartContainerPeriodo").innerHTML = "&nbsp;";
    document.getElementById("chartContainerPeriodo").innerHTML =
      '<canvas id="lineChartOcorrenciaPeriodo"  height="75%" [@chamado]="estado"></canvas>';
  }

  public listarQuantidadeOcorrenciaPeriodo(): void {
    this.limparChartOcorrenciaPeriodo();
    this.feedbackUsuario = "Carregando dados, aguarde...";
    let esc_id: number = parseInt(
      Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT)
    );
    this.disciplinarService.listarGraficoQuantitativoPeriodo(
      esc_id,
      this.dataInicioQuantidadeOcorrencias,
      this.dataFimQuantidadeOcorrencias
    )
      .toPromise()
      .then((response: Response) => {
        this.arrayOfLabelsOcorrenciasPeriodo = [];
        this.arrayOfDadosOcorrenciasPeriodo = [];
        this.feedbackUsuario = undefined;
        let responseLength = Object.keys(response).length;
        this.quantidadeOcorrenciasPeriodo = response;
        for (let i = 0; i < responseLength; i++) {
          this.arrayOfLabelsOcorrenciasPeriodo.push(
            this.quantidadeOcorrenciasPeriodo[i]["data"]
          );
          this.arrayOfDadosOcorrenciasPeriodo.push(
            this.quantidadeOcorrenciasPeriodo[i]["quantidade"]
          );
        }
        this.chartHistoricoQuantidadeOcorrencias();
      })
      .catch((erro: Response) => {
        this.feedbackUsuario = undefined;
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
        //Gravar erros no analytics
        Utils.gravarErroAnalytics(JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
      });
  }

  //*******************************QUANTIDADE DE OCORRÊNCIAS DE TURMA POR PERIODO***************************************//
  public chartHistoricoQuantidadeOcorrenciasTurma(): void {
    this.lineChartOcorrenciaTurmaPeriodo = new Chart(
      "lineChartOcorrenciaTurmaPeriodo",
      {
        type: "bar",
        data: {
          labels: this.arrayOfLabelsOcorrenciasTurmaPeriodo,
          datasets: [
            {
              label: "Quantidade de ocorrências por turma",
              data: this.arrayOfDadosOcorrenciasTurmaPeriodo,
              lineTension: 0.2,
              backgroundColor: this.arrayOfCoresOcorrenciasTurmaPeriodo,
              borderColor: ["rgba(255, 159, 64, 0.5)"],
              borderWidth: 2
            }
          ]
        },
        options: {
          onClick: (e, items) => {
            this.selecionarTurmaComboBox(items[0]._chart.config.data.labels[items[0]._index]);
          },
          responsive: true,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          },
          maintainAspectRatio: false,
          animation: {
            duration: 250,
            easing: "easeInQuart"
          },
          tooltips: {
            backgroundColor: "rgba(72, 133, 237, 0.75)",
            borderColor: "rgb(255,255,255)",
            borderWidth: 2,
            callbacks: {
              labelColor: function (tooltipItem, chart) {
                return {
                  borderColor: "rgb(0, 0, 0)",
                  backgroundColor: "rgb(0, 0, 0)"
                };
              },
              labelTextColor: function (tooltipItem, chart) {
                return "rgb(255,255, 255)";
              }
            }
          },

        }
      }
    );
  }

  public selecionarTurmaComboBox(turmaClicada: string): void {
    var select = <HTMLSelectElement>document.getElementById('turmas');
    for (var i = 0; i < select.options.length; i++) {
      const textoSelect = select.options[i].text;
      if (textoSelect.includes(turmaClicada)) {
        select.selectedIndex = i;
        this.trm_id = parseInt(select.options[i].value);
        break;
      }
    }
    this.pesquisarQuantidadeOcorrenciaEstudante();
  }

  public ativarTabOcorrenciasPorEstudante(): void {
    document.getElementById('turma').classList.remove('active');
    document.getElementById('turma-tab').classList.remove('active');
    document.getElementById('estudante').classList.add('active');
    document.getElementById('estudante-tab').classList.add('active');
    document.getElementById('estudante').classList.add('show');
  }


  public gravarDataInicioTurma(event: Event): void {
    this.dataInicioQuantidadeOcorrenciasTurma = (<HTMLInputElement>(
      event.target
    )).value;
  }

  public gravarDataFimTurma(event: Event): void {
    this.dataFimQuantidadeOcorrenciasTurma = (<HTMLInputElement>(
      event.target
    )).value;
  }

  public pesquisarQuantidadeOcorrenciaTurma(): void {
    this.listarQuantidadeOcorrenciaTurmaPeriodo();
  }

  public limparChartOcorrenciaTurma(): void {
    document.getElementById("chartContainerTurma").innerHTML = "&nbsp;";
    document.getElementById("chartContainerTurma").innerHTML =
      '<canvas id="lineChartOcorrenciaTurmaPeriodo"  height="75%" [@chamado]="estado"></canvas>';
  }

  public listarQuantidadeOcorrenciaTurmaPeriodo(): void {
    let esc_id: number = parseInt(
      Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT)
    );
    this.limparChartOcorrenciaTurma();
    this.feedbackUsuario = "Carregando dados, aguarde...";
    this.disciplinarService
      .listarGraficoQuantitativoTurmaPeriodo(
        esc_id,
        this.dataInicioQuantidadeOcorrenciasTurma,
        this.dataFimQuantidadeOcorrenciasTurma
      )
      .toPromise()
      .then((response: Response) => {
        this.arrayOfLabelsOcorrenciasTurmaPeriodo = [];
        this.arrayOfCoresOcorrenciasTurmaPeriodo = [];
        this.arrayOfDadosOcorrenciasTurmaPeriodo = [];
        this.feedbackUsuario = undefined;
        let responseLength = Object.keys(response).length;
        this.quantidadeOcorrenciasTurmaPeriodo = response;
        for (let i = 0; i < responseLength; i++) {
          this.arrayOfCoresOcorrenciasTurmaPeriodo.push(
            "rgba(219, 50, 54,0.5)"
          );

          this.arrayOfLabelsOcorrenciasTurmaPeriodo.push(
            this.quantidadeOcorrenciasTurmaPeriodo[i]["turma"]
          );
          this.arrayOfDadosOcorrenciasTurmaPeriodo.push(
            this.quantidadeOcorrenciasTurmaPeriodo[i]["quantidade"]
          );
        }
        this.chartHistoricoQuantidadeOcorrenciasTurma();
      })
      .catch((erro: Response) => {
        this.feedbackUsuario = undefined;
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
        //Gravar erros no analytics
        Utils.gravarErroAnalytics(JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
      });
  }

  //*******************************QUANTIDADE DE OCORRÊNCIAS DE ESTUDANTE POR PERIODO***************************************//
  public gravarTurmaId(event: Event): void {
    this.trm_id = parseInt((<HTMLInputElement>event.target).value);
  }

  public listarTurma(): void {
    this.feedbackUsuario = "Carregando dados, aguarde...";
    let esc_id: number = parseInt(
      Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT)
    );
    let ano: number = new Date().getFullYear();
    this.turmaService
      .listarTodasAno(ano, esc_id)
      .toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = undefined;
        this.turmas = response;
      })
      .catch((erro: Response) => {
        this.feedbackUsuario = undefined;
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
        //Gravar erros no analytics
        Utils.gravarErroAnalytics(JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
      });
  }

  public chartHistoricoQuantidadeOcorrenciasEstudante(): void {
    this.lineChartOcorrenciaEstudantePeriodo = new Chart(
      "lineChartOcorrenciaEstudantePeriodo",
      {
        type: "bar",
        data: {
          labels: this.arrayOfLabelsOcorrenciasEstudantePeriodo,
          datasets: [
            {
              label: "Quantidade de ocorrências por Estudante",
              data: this.arrayOfDadosOcorrenciasEstudantePeriodo,
              lineTension: 0.2,
              backgroundColor: this.arrayOfCoresOcorrenciasEstudantePeriodo,
              borderColor: ["rgba(255, 159, 64, 0.5)"],
              borderWidth: 2
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          },
          maintainAspectRatio: false,
          animation: {
            duration: 250,
            easing: "easeInQuart"
          },
          tooltips: {
            backgroundColor: "rgba(72, 133, 237, 0.75)",
            borderColor: "rgb(255,255,255)",
            borderWidth: 2,
            callbacks: {
              labelColor: function (tooltipItem, chart) {
                return {
                  borderColor: "rgb(0, 0, 0)",
                  backgroundColor: "rgb(0, 0, 0)"
                };
              },
              labelTextColor: function (tooltipItem, chart) {
                return "rgb(255,255, 255)";
              }
            }
          }
        }
      }
    );
  }

  public gravarDataInicioEstudante(event: Event): void {
    this.dataInicioQuantidadeOcorrenciasEstudante = (<HTMLInputElement>(
      event.target
    )).value;
  }

  public gravarDataFimEstudante(event: Event): void {
    this.dataFimQuantidadeOcorrenciasEstudante = (<HTMLInputElement>(
      event.target
    )).value;
  }

  public pesquisarQuantidadeOcorrenciaEstudante(): void {
    this.listarQuantidadeOcorrenciaEstudantePeriodo();
  }

  public limparChartOcorrenciaEstudante(): void {
    document.getElementById("chartContainerEstudante").innerHTML = "&nbsp;";
    document.getElementById("chartContainerEstudante").innerHTML =
      '<canvas id="lineChartOcorrenciaEstudantePeriodo"  height="75%" [@chamado]="estado"></canvas>';
  }

  public listarQuantidadeOcorrenciaEstudantePeriodo(): void {
    this.limparChartOcorrenciaEstudante();
    this.feedbackUsuario = "Carregando dados, aguarde...";
    this.disciplinarService
      .listarGraficoQuantitativoEstudantePeriodo(
        this.trm_id,
        this.dataInicioQuantidadeOcorrenciasEstudante,
        this.dataFimQuantidadeOcorrenciasEstudante
      )
      .toPromise()
      .then((response: Response) => {
        this.arrayOfLabelsOcorrenciasEstudantePeriodo = [];
        this.arrayOfCoresOcorrenciasEstudantePeriodo = [];
        this.arrayOfDadosOcorrenciasEstudantePeriodo = [];
        this.feedbackUsuario = undefined;
        let responseLength = Object.keys(response).length;
        this.quantidadeOcorrenciasEstudantePeriodo = response;
        for (let i = 0; i < responseLength; i++) {
          this.arrayOfCoresOcorrenciasEstudantePeriodo.push(
            "rgba(219, 50, 54,0.5)"
          );
          this.arrayOfLabelsOcorrenciasEstudantePeriodo.push(
            (<string>this.quantidadeOcorrenciasEstudantePeriodo[i]["estudante"]).split(' ')[0]
          );
          this.arrayOfDadosOcorrenciasEstudantePeriodo.push(
            this.quantidadeOcorrenciasEstudantePeriodo[i]["quantidade"]
          );
        }
        this.ativarTabOcorrenciasPorEstudante();
        this.chartHistoricoQuantidadeOcorrenciasEstudante();
      })
      .catch((erro: Response) => {
        this.feedbackUsuario = undefined;
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
        //Gravar erros no analytics
        Utils.gravarErroAnalytics(JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
      });
  }

  //*******************************QUANTIDADE DE OCORRÊNCIAS POR TIPO E PERIODO***************************************//

  public mostrarOcorrenciasPorTipo(): void {
    this.pesquisarQuantidadeTipoOcorrencia();
  }

  public chartQuantidadeOcorrenciasTipo(): void {
    this.lineChartTipoOcorrenciaPeriodo = new Chart(
      "lineChartTipoOcorrenciaPeriodo",
      {
        type: "bar",
        data: {
          labels: this.arrayOfLabelsTipoOcorrenciasPeriodo,
          datasets: [
            {
              label: "Quantidade de ocorrências por Tipo",
              data: this.arrayOfDadosTipoOcorrenciasPeriodo,
              lineTension: 0.2,
              backgroundColor: this.arrayOfCoresTipoOcorrenciasPeriodo,
              borderColor: ["rgba(255, 159, 64, 0.5)"],
              borderWidth: 2
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          },
          maintainAspectRatio: false,
          animation: {
            duration: 250,
            easing: "easeInQuart"
          },
          tooltips: {
            backgroundColor: "rgba(72, 133, 237, 0.75)",
            borderColor: "rgb(255,255,255)",
            borderWidth: 2,
            callbacks: {
              labelColor: function (tooltipItem, chart) {
                return {
                  borderColor: "rgb(0, 0, 0)",
                  backgroundColor: "rgb(0, 0, 0)"
                };
              },
              labelTextColor: function (tooltipItem, chart) {
                return "rgb(255,255, 255)";
              }
            }
          },
        }
      }
    );
  }

  public gravarDataInicioTipoOcorrencia(event: Event): void {
    this.dataInicioQuantidadeTipoOcorrencias = (<HTMLInputElement>(
      event.target
    )).value;
  }

  public gravarDataFimTipoOcorrencia(event: Event): void {
    this.dataFimQuantidadeTipoOcorrencias = (<HTMLInputElement>(
      event.target
    )).value;
  }

  public pesquisarQuantidadeTipoOcorrencia(): void {
    this.listarQuantidadeTipoOcorrenciaPeriodo();
  }

  public limparChartTipoOcorrencia(): void {
    document.getElementById("chartContainerTipoOcorrencia").innerHTML =
      "&nbsp;";
    document.getElementById("chartContainerTipoOcorrencia").innerHTML =
      '<canvas id="lineChartTipoOcorrenciaPeriodo"  height="75%" [@chamado]="estado"></canvas>';
  }

  public listarQuantidadeTipoOcorrenciaPeriodo(): void {
    let esc_id: number = parseInt(
      Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT)
    );
    this.limparChartTipoOcorrencia();
    this.feedbackUsuario = "Carregando dados, aguarde...";
    this.disciplinarService
      .listarGraficoQuantitativoTipoOcorrenciaPeriodo(
        esc_id,
        this.dataInicioQuantidadeTipoOcorrencias,
        this.dataFimQuantidadeTipoOcorrencias
      )
      .toPromise()
      .then((response: Response) => {
        this.arrayOfLabelsTipoOcorrenciasPeriodo = [];
        this.arrayOfCoresTipoOcorrenciasPeriodo = [];
        this.arrayOfDadosTipoOcorrenciasPeriodo = [];
        this.feedbackUsuario = undefined;
        let responseLength = Object.keys(response).length;
        this.quantidadeTipoOcorrenciasPeriodo = response;
        for (let i = 0; i < responseLength; i++) {
          this.arrayOfCoresTipoOcorrenciasPeriodo.push("rgba(219, 50, 54,0.5)");
          this.arrayOfLabelsTipoOcorrenciasPeriodo.push(
            this.quantidadeTipoOcorrenciasPeriodo[i]["tipo_ocorrencia"]
          );
          this.arrayOfDadosTipoOcorrenciasPeriodo.push(
            this.quantidadeTipoOcorrenciasPeriodo[i]["quantidade"]
          );
        }
        this.chartQuantidadeOcorrenciasTipo();
      })
      .catch((erro: Response) => {
        this.feedbackUsuario = undefined;
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
        //Gravar erros no analytics
        Utils.gravarErroAnalytics(JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
      });
  }

}
