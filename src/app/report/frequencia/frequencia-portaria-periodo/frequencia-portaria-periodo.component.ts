import { Component, OnInit } from '@angular/core';
import { PortariaService } from '../../../crud/portaria/portaria.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router } from '@angular/router';
import { Chart } from "chart.js";
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-frequencia-portaria-periodo',
  templateUrl: './frequencia-portaria-periodo.component.html',
  styleUrls: ['./frequencia-portaria-periodo.component.scss'],
  providers: [PortariaService],
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
export class FrequenciaPortariaPeriodoComponent implements OnInit {

  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public esc_id: number;
  public dados_escola = new Array<Object>();
  public dataInicio: string;
  public dataFim: string;

  public registrosFrequencia: Object[];
  public arrayOfDadosQuantidadeFrequencia = new Array<number>();
  public arrayOfLabelsQuantidadeFrequencia = new Array<string>();
  public arrayOfColors = new Array<string>();
  constructor(private portariaService: PortariaService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router
  ) { }

  public lineChartnotaFaltasPeriodo: Chart;

  ngOnInit() {
    this.dados_escola = JSON.parse(Utils.decriptAtoB(localStorage.getItem("dados_escola"), CONSTANTES.PASSO_CRIPT))[0];
    this.esc_id = parseInt(this.dados_escola["id"]);
    this.dataInicio = `${(new Date()).getFullYear().toString()}-01-01`;
    this.dataFim = Utils.dataAtual()
  }

  public atualizarData(event: Event): void {
    let nomeComponente = (<HTMLInputElement>event.target).name;
    if (nomeComponente == "data_inicio") {
      this.dataInicio = (<HTMLInputElement>event.target).value;
    } else {
      this.dataFim = (<HTMLInputElement>event.target).value;
    }
  }

  public atualizarGrafico(): void {
    this.arrayOfDadosQuantidadeFrequencia = [];
    this.arrayOfLabelsQuantidadeFrequencia = [];
    this.arrayOfColors = [];
    this.listarFrequenciasEntradaPeriodo();
  }

  public listarFrequenciasEntradaPeriodo(): void {
    this.feedbackUsuario = "Carregando registros de frequencia das portarias, aguarde..."
    this.portariaService.listarFrequenciaPortariaPeriodo(this.dataInicio, this.dataFim, 0, this.esc_id).toPromise().then((response: Response) => {
      this.registrosFrequencia = Object.values(response);
      this.registrosFrequencia.forEach(registroFrequencia => {
        this.arrayOfDadosQuantidadeFrequencia.push(registroFrequencia["quantidade"]);
        this.arrayOfLabelsQuantidadeFrequencia.push(registroFrequencia["data"]);
        this.arrayOfColors.push("rgba( 72, 133, 237,0.75)");
      })
      this.feedbackUsuario = undefined;
      this.atualizarChartEntradaPortaria();
    }).catch((erro: Response) => {
      //Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      //registra log de erro no firebase usando serviço singlenton
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
      //Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
      this.feedbackUsuario = undefined;
    })
  }

  public listarFrequenciasSaidaPeriodo(): void {
    this.feedbackUsuario = "Carregando registros de frequencia das portarias, aguarde..."
    this.portariaService.listarFrequenciaPortariaPeriodo(this.dataInicio, this.dataFim, 1, this.esc_id).toPromise().then((response: Response) => {
      this.registrosFrequencia = Object.values(response);
      this.registrosFrequencia.forEach(registroFrequencia => {
        this.arrayOfDadosQuantidadeFrequencia.push(registroFrequencia["quantidade"]);
        this.arrayOfLabelsQuantidadeFrequencia.push(registroFrequencia["data"]);
        this.arrayOfColors.push("rgba( 244,160,0,0.75)");
      })
      this.feedbackUsuario = undefined;
      this.atualizarChartEntradaPortaria();
    }).catch((erro: Response) => {
      //Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      //registra log de erro no firebase usando serviço singlenton
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
      //Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
      this.feedbackUsuario = undefined;
    })
  }

  public atualizarChartEntradaPortaria(): void {
    let context = (<HTMLCanvasElement>document.getElementById('lineChartnotaFaltasPeriodo')).getContext('2d');
    if (this.lineChartnotaFaltasPeriodo != undefined)
      this.lineChartnotaFaltasPeriodo.destroy();

    this.lineChartnotaFaltasPeriodo = new Chart(context, {
      type: "line",
      data: {
        labels: this.arrayOfLabelsQuantidadeFrequencia,
        datasets: [
          {
            label: "",
            yAxisID: "frequencias",
            data: this.arrayOfDadosQuantidadeFrequencia,
            lineTension: 0.2,
            backgroundColor: this.arrayOfColors,
            borderColor: ["rgba(255, 159, 64, 0.5)"],
            borderWidth: 2
          },
        ]
      },
      options: {
        legend: { display: false },

        title: { text: "Frequencia da entrada portaria", fontSize: 20, position: "top", display: true },
        responsive: true,
        scales: {
          yAxes: [
            {
              id: "frequencias",
              ticks: {
                beginAtZero: true,
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

  public atualizarChartSaidaPortaria(): void {
    let context = (<HTMLCanvasElement>document.getElementById('lineChartnotaFaltasPeriodo')).getContext('2d');
    if (this.lineChartnotaFaltasPeriodo != undefined)
      this.lineChartnotaFaltasPeriodo.destroy();

    this.lineChartnotaFaltasPeriodo = new Chart(context, {
      type: "line",
      data: {
        labels: this.arrayOfLabelsQuantidadeFrequencia,
        datasets: [
          {
            label: "",
            yAxisID: "frequencias",
            data: this.arrayOfDadosQuantidadeFrequencia,
            lineTension: 0.2,
            backgroundColor: this.arrayOfColors,
            borderColor: ["rgba(255, 159, 64, 0.5)"],
            borderWidth: 2
          },
        ]
      },
      options: {
        legend: { display: false },

        title: { text: "Frequencia da saída portaria", fontSize: 20, position: "top", display: true },
        responsive: true,
        scales: {
          yAxes: [
            {
              id: "frequencias",
              ticks: {
                beginAtZero: true,
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

}
