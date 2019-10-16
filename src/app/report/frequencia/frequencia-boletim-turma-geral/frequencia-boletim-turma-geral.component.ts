import { Component, OnInit } from '@angular/core';
import { BoletimEstudanteService } from '../../../crud/boletim-estudante/boletim-estudante.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Utils } from '../../../shared/utils.shared';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TurmaService } from '../../../crud/turma/turma.service';
import { Chart } from "chart.js";

@Component({
  selector: 'ngx-frequencia-boletim-turma-geral',
  templateUrl: './frequencia-boletim-turma-geral.component.html',
  styleUrls: ['./frequencia-boletim-turma-geral.component.scss'],
  providers: [BoletimEstudanteService, TurmaService],
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
export class FrequenciaBoletimTurmaGeralComponent implements OnInit {
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public esc_id: number;
  public arrayOfFaltasEstudantes = new Array<Object>();
  public arrayOfTurmas = new Array<object>();
  public anoAtual: number;
  public stringTurmaSelecionada: string = "Selecione uma turma...";
  public trm_id_selecionada: number = 0;
  private minimoDeFaltas: number = 0;
  public limiteAulasPerdidas: number = 300;
  public arrayOfFaltasEstudantesReferencia = new Array<Object>();
  public chartEstatisticaFaltas: Chart;

  constructor(
    private boletimEstudanteService: BoletimEstudanteService,
    private turmaService: TurmaService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router,
    private route: ActivatedRoute, ) { }

  ngOnInit() {
    this.minimoDeFaltas = 0;
    this.esc_id = parseInt(Utils.decriptAtoB(localStorage.getItem('esc_id'), CONSTANTES.PASSO_CRIPT));
    this.anoAtual = (new Date).getFullYear();
    this.listarTurmas();
  }

  public definirMinimoFaltas(event: Event): void {
    if ((<HTMLInputElement>event.target).value == null || (<HTMLInputElement>event.target).value == undefined) {
      this.minimoDeFaltas = 0;
    } else {
      this.minimoDeFaltas = parseInt((<HTMLInputElement>event.target).value);
    }
    this.listarFaltasEstudantesBoletim(this.esc_id, this.trm_id_selecionada);
  }

  public definirMaximoFaltas(event: Event): void {
    if ((<HTMLInputElement>event.target).value == null || (<HTMLInputElement>event.target).value == undefined) {
      this.limiteAulasPerdidas = 300;
    } else {
      this.limiteAulasPerdidas = parseInt((<HTMLInputElement>event.target).value);
    }
    this.listarFaltasEstudantesBoletim(this.esc_id, this.trm_id_selecionada);
  }

  public filtroMinimoOcorrencias(objeto: Object): boolean {
    return parseInt(objeto['faltas']) >= parseInt(objeto['minimo_faltas']);
  }

  public filtrarMinimoOcorrencias(arrayOfEstudantes: Object[]): Object[] {
    return arrayOfEstudantes.filter(this.filtroMinimoOcorrencias);
  }

  public gerenciarRelatorioFrequencia(): void {
    this.router.navigate([this.route.parent.routeConfig.path]);
  }

  public listarFaltasEstudantesBoletim(esc_id: number, trm_id: number): void {
    this.feedbackUsuario = 'Carregando faltas dos estudantes, aguarde...';
    this.boletimEstudanteService.listarFaltasTurmaGeralBoletim(esc_id, trm_id, this.minimoDeFaltas).toPromise().then((response: Response) => {
      this.feedbackUsuario = undefined;
      this.arrayOfFaltasEstudantes = this.filtrarMinimoOcorrencias(Object.values(response));
      //this.arrayOfFaltasEstudantesReferencia = this.arrayOfFaltasEstudantes;
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
    this.feedbackUsuario = 'Listando turmas, aguarde...';
    this.turmaService.listarTodasAno(this.anoAtual, this.esc_id).toPromise().then((response: Response) => {
      this.feedbackUsuario = undefined;
      this.arrayOfTurmas = Object.values(response);
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

  public selecionarTurma(event: Event): void {
    this.trm_id_selecionada = parseInt((<HTMLInputElement>event.target).id);
    this.stringTurmaSelecionada = ((<HTMLInputElement>event.target).name);
    this.listarFaltasEstudantesBoletim(this.esc_id, this.trm_id_selecionada);
  }

  public tendenciaFaltasEstudante(estudante: Object): void {
    alert(`Aqui, gráfico de: ${JSON.stringify(estudante['estudante'])}`);
  }

  public mostrarEstatisticaFaltas(estudante: Object) {
    /* Dados da linha fixa */
    const dadosLinhaLimite = new Array<Object>()
    const labelsLinhaLimite = new Array<string>()
    const est_id = estudante["est_id"];

    dadosLinhaLimite.push(...[
      this.limiteAulasPerdidas,
      this.limiteAulasPerdidas,
      this.limiteAulasPerdidas,
      this.limiteAulasPerdidas,
      this.limiteAulasPerdidas
    ]);
    labelsLinhaLimite.push(...['0', '1º', '2º', '3º', '4º']);
    /* Construção do DataSet do Estudante */
    const bimestres_fechados = parseInt(estudante['bimestres_fechados']);
    const valor_x_bimestre = this.limiteAulasPerdidas / 4;
    const coeficiente_inclinacao = parseInt(estudante['faltas']) / (valor_x_bimestre * bimestres_fechados);
    const dadosLinhaEstudante = new Array<Object>()
    for (let i = 0; i <= bimestres_fechados; i++) {
      dadosLinhaEstudante.push(i * coeficiente_inclinacao * valor_x_bimestre);
    }

    /* Construção do reta projetadaDataSet do Estudante */
    const dadosLinhaProjetada = new Array<Object>()
    for (let i = 0; i <= 4; i++) {
      dadosLinhaProjetada.push(i * coeficiente_inclinacao * valor_x_bimestre);
    }
    this.lineChartEstatisticaFaltas(dadosLinhaLimite, labelsLinhaLimite, dadosLinhaProjetada, dadosLinhaEstudante, est_id);
  }

  public lineChartEstatisticaFaltas(dadosLinhaLimite: Object[], labelsLinha: string[], dadosLinhaProjetada: Object[], dadosLinhaEstudante: Object[], est_id: string): void {
    this.chartEstatisticaFaltas = new Chart("chartEstatisticaFaltas" + est_id, {
      type: "line",
      data: {
        labels: labelsLinha,
        datasets: [
          {
            data: dadosLinhaLimite,
            borderColor: ["rgba(219, 50, 54,0.5)", "rgba(219, 50, 54,0.5)"],
            fill: false,
            borderWidth: 5,
            label: 'Limite',
          },
          {
            data: dadosLinhaEstudante,
            borderColor: ["rgba(15,157,88,0.5)", "rgba(15,157,88,0.5)"],
            fill: false,
            borderWidth: 5,
            label: 'Estudante',
          },
          {
            data: dadosLinhaProjetada,
            borderColor: ["rgba(0,0,0,0.25)", "rgba(0,0,0,0.25)"],
            fill: false,
            borderDash: [10, 5],
            dash: true,
            borderWidth: 2,
            label: 'Projeção',
          }
        ]
      },
      options: {
        scales: {
          yAxes: [{
            display: true,
            ticks: {
              beginAtZero: true,
              steps: 10,
              stepValue: 5,
              max: this.limiteAulasPerdidas + 50,
            }
          }]
        },
        responsiveAnimationDuration: 400,
        lineTension: 0,
        bezierCurve: false,
        animation: {
          duration: 400,
          easing: "linear",
        },
        tooltips: {
          backgroundColor: "rgba(72, 133, 237, 0.75)",
          borderColor: "rgb(255,255,255)",
          borderWidth: 1,
          bodyFontSize: 25,
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

}
