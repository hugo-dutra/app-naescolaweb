import { Component, OnInit } from '@angular/core';
import { RendimentoService } from '../../rendimento/rendimento.service';
import { TurmaService } from '../../../crud/turma/turma.service';
import { PeriodoLetivoService } from '../../../crud/periodo-letivo/periodo-letivo.service';
import { DisciplinarService } from '../../disciplinar/disciplinar.service';
import { PortariaService } from '../../../crud/portaria/portaria.service';
import { EstudanteService } from '../../../crud/estudante/estudante.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Chart } from 'chart.js';
import { ResultadoEstudante, NotaFaltasDisciplinaEstudante } from '../../rendimento/resultado-estudante.model';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';
import { OcorrenciaService } from '../../../crud/ocorrencia/ocorrencia.service';
import { AcessoComumService } from '../../../shared/acesso-comum/acesso-comum.service';
import { HintService } from 'angular-custom-tour';

@Component({
  selector: 'ngx-conselho-analise-estudante',
  templateUrl: './conselho-analise-estudante.component.html',
  styleUrls: ['./conselho-analise-estudante.component.scss'],
  providers: [
    RendimentoService,
    TurmaService,
    PeriodoLetivoService,
    DisciplinarService,
    PortariaService,
    EstudanteService,
    OcorrenciaService,
    HintService,
  ],
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
export class ConselhoAnaliseEstudanteComponent implements OnInit {

  public feedbackUsuario: string;
  public estado: string = 'visivel';
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public turmas: Object[];
  public periodosLetivos: Object[];
  public dados_escola = new Array<Object>();
  public anoAtual: number;
  public esc_id: number;
  public usr_id: number;
  public trm_id_selecionada: number = 0;
  public stringTurmaSelecionada: string = 'Selecione uma turma';
  public prl_id_selecionado: number = 0;
  public stringPeriodoSelecionado: string = 'Selecione um periodo';
  public stringInicioPeriodoSelecionado: string;
  public stringFimPeriodoSelecionado: string;
  public textoObservacaoEstudante: string;

  // *************************FREQUENCIA DA PORTARIA*************************/
  public arrayOfFrequenciasPortariasEstudantes = new Array<Object>();
  public arrayOfQuantidadeFrequenciasPortariasEstudante = new Array<number>();
  public arrayOfLabelFrequenciasPortariasEstudante = new Array<string>();
  public arrayOfFrequenciaColors = new Array<string>();
  public pieChartFrequenciaPortariaPeriodo: Chart;


  // *************************ESTATISTICA DE ENTREGA DE MENSAGENS*************************/
  public pieChartEstatisticaEntregaAtividades: Chart;
  public pieChartEstatisticaEntregaComunicados: Chart;
  public pieChartEstatisticaEntregaFrequencias: Chart;
  public pieChartEstatisticaEntregaOcorrencias: Chart;


  // *************************DISCIPLINAR*************************/
  public arrayOfQuantidadeOcorrenciasDisciplinaresEstudante = new Array<number>();
  public arrayOfTipoOcorrenciasDisciplinaresEstudante = new Array<string>();
  public arrayOfOcorrenciasColors = new Array<string>();
  public arrayOfOcorrenciasDisciplinaresEstudantes = new Array<Object>();
  public barChartDisciplinarPeriodo: Chart;
  public arrayOfOcorrenciasEstudante = new Array<Object>();

  // *************************RENDIMENTO*************************/
  public notaDeCorte: number = 5;
  public barChartnotaFaltasPeriodo: Chart;
  public radarChartMediaAreaConhecimento: Chart;
  public arrayOfDadosNotaPeriodo = new Array<number>();
  public arrayOfDadosFaltasPeriodo = new Array<number>();
  public arrayOfLabelsNotaPeriodo = new Array<string>();
  public arrayOfNotaColors = new Array<string>();
  public arrayOfFaltasColors = new Array<string>();
  public resultadosEstudantes = new Array<ResultadoEstudante>();
  public estudanteSelecionado = new ResultadoEstudante;
  public tipoGraficoAproveitamentoSelecionado = 0;

  /* ENTREGA DE MENSAGENS */
  public arrayDeEstatisticaMensagensAtividades = new Array<Number>();
  public arrayDeEstatisticaMensagensComunicados = new Array<Number>();
  public arrayDeEstatisticaMensagensFrequencias = new Array<Number>();
  public arrayDeEstatisticaMensagensOcorrencias = new Array<Number>();

  public arrayOfRendimentoAreaConhecimentoEstudantes = new Array<Object>();
  public arrayDadosAreaConhecimentoEstudanteSelecionado = new Array<number>();
  public arrayLabelsAreaConhecimentoEstudanteSelecionado = new Array<string>();
  public arrayColorsAreaConhecimentoEstudanteSelecionado = new Array<string>();
  public escalaFixa: boolean = true;
  public dataSetEscalaFixa = [0, 10];

  constructor(
    private rendimentoService: RendimentoService,
    private turmaService: TurmaService,
    private periodoLetivoService: PeriodoLetivoService,
    private disciplinarService: DisciplinarService,
    private portariaService: PortariaService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router,
    private estudanteService: EstudanteService,
    private ocorrenciaService: OcorrenciaService,
    private acessoComumService: AcessoComumService,
    private hintService: HintService,
  ) { }

  ngOnInit() {
    this.dados_escola = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados_escola'), CONSTANTES.PASSO_CRIPT))[0];
    this.esc_id = parseInt(this.dados_escola['id'], 10);
    this.usr_id = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados'), CONSTANTES.PASSO_CRIPT))[0].id;
    this.anoAtual = (new Date()).getFullYear();
    this.carregarTurmas();
    this.subscribeTour();
  }

  public subscribeTour(): void {
    this.acessoComumService.emitirAlertaInicioTour.subscribe(() => {
      this.hintService.initialize({ elementsDisabled: false });
    });
  }

  // ####################################### BLOCO DE MÉTODOS DE AUXILIARES #######################################//
  public carregarTurmas(): void {
    this.feedbackUsuario = 'Carregando turmas, aguarde...';
    this.turmaService.listarTodasAno(this.anoAtual, this.esc_id).toPromise().then((response: Response) => {
      this.turmas = Object.values(response);
      this.carregarPeriodoLetivo();
    }).catch((erro: Response) => {
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
    });
  }

  public carregarPeriodoLetivo(): void {
    this.feedbackUsuario = 'Listando períodos letivos';
    this.periodoLetivoService.listarPorAno(this.anoAtual).toPromise().then((response: Response) => {
      this.periodosLetivos = Object.values(response);
      this.feedbackUsuario = undefined;
    });
  }

  public selecionarTurma(event: Event): void {
    this.trm_id_selecionada = parseInt((<HTMLInputElement>event.target).value, 10);
    if (this.trm_id_selecionada != 0 && this.prl_id_selecionado != 0) {
      this.carregarDadosDoPeriodoSelecionado();
    } else {
      this.arrayOfLabelsNotaPeriodo = [];
      this.arrayOfDadosNotaPeriodo = [];
      this.arrayOfDadosFaltasPeriodo = [];
      this.arrayOfNotaColors = [];
    }
  }

  public carregarDadosDoPeriodoSelecionado(): void {
    this.feedbackUsuario = 'Carregando dados...';
    this.periodoLetivoService.listarPorId(this.prl_id_selecionado).toPromise().then((response: Response) => {
      const dadosPeriodoLetivo = Object.values(response);
      this.stringInicioPeriodoSelecionado = dadosPeriodoLetivo[0]['inicio'];
      this.stringFimPeriodoSelecionado = dadosPeriodoLetivo[0]['fim'];
      this.feedbackUsuario = 'Carregando estudantes, aguarde...';
      this.carregarResultadosTurma();
    });
  }

  public selecionarPeriodo(event: Event): void {

    this.prl_id_selecionado = parseInt((<HTMLInputElement>event.target).value, 10);
    if (this.trm_id_selecionada != 0 && this.prl_id_selecionado != 0) {
      this.carregarDadosDoPeriodoSelecionado();
    } else {
      this.arrayOfLabelsNotaPeriodo = [];
      this.arrayOfDadosNotaPeriodo = [];
      this.arrayOfDadosFaltasPeriodo = [];
      this.arrayOfNotaColors = [];
    }
  }

  public inserirObservacaoEstudante(): void {
    this.feedbackUsuario = 'Adicionando observação do estudante, aguarde...';
    this.estudanteService.inserirObservacao(
      this.usr_id,
      this.estudanteSelecionado.est_id,
      this.textoObservacaoEstudante)
      .toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = undefined;
        this.limparTextAreaObservacao();
      }).catch((erro: Response) => {
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
      });
  }

  public limparTextAreaObservacao(): void {
    (<HTMLInputElement>document.getElementById('textAreaObservacaoEstudante')).value = '';
  }

  public atualizarTextoObservacao(event: Event): void {
    this.textoObservacaoEstudante = (<HTMLInputElement>event.target).value;
  }

  // ############################# BLOCO DE MÉTODOS DE FREQUENCIA DA PORTARIA #############################//
  public carregarDadosFrequenciaPortariaTurma(): void {
    this.feedbackUsuario = 'Carregando dados de frequencia da portaria dos estudantes, aguarde...';
    this.portariaService.verificarAbsenteismoTotalPorTurma(
      this.trm_id_selecionada,
      this.esc_id,
      this.stringInicioPeriodoSelecionado,
      this.stringFimPeriodoSelecionado, 1000)
      .toPromise()
      .then((response: Response) => {
        this.arrayOfFrequenciasPortariasEstudantes = Object.values(response);
        this.carregarResultadosAreaConhecimento();
      }).catch((erro: Response) => {
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
      });
  }

  public gravarFrequenciaPortariaEstudanteSelecionado(): void {
    this.arrayOfQuantidadeFrequenciasPortariasEstudante = [];
    this.arrayOfQuantidadeFrequenciasPortariasEstudante = [];
    this.arrayOfLabelFrequenciasPortariasEstudante = [];
    this.arrayOfLabelFrequenciasPortariasEstudante = [];
    this.arrayOfFrequenciaColors = [];

    this.arrayOfFrequenciasPortariasEstudantes.forEach(frequenciaPortaria => {
      const est_id = frequenciaPortaria['est_id'];
      if (this.estudanteSelecionado.est_id == est_id) {
        this.arrayOfQuantidadeFrequenciasPortariasEstudante.push(frequenciaPortaria['presencas']);
        this.arrayOfQuantidadeFrequenciasPortariasEstudante.push(frequenciaPortaria['faltas']);
        this.arrayOfLabelFrequenciasPortariasEstudante.push('Presenças');
        this.arrayOfLabelFrequenciasPortariasEstudante.push('Faltas');
        this.arrayOfFrequenciaColors.push('rgba(60, 186, 84,0.75)');
        this.arrayOfFrequenciaColors.push('rgba(219, 50, 54,0.75)');
        this.atualizarChartFrequenciaPortariaPeriodo();
        return;
      }
    });
  }

  public atualizarChartFrequenciaPortariaPeriodo(): void {
    const context = (<HTMLCanvasElement>document.getElementById('pieChartFrequenciaPortariaPeriodo')).getContext('2d');
    if (this.pieChartFrequenciaPortariaPeriodo != undefined)
      this.pieChartFrequenciaPortariaPeriodo.destroy();

    this.pieChartFrequenciaPortariaPeriodo = new Chart(context, {
      type: 'pie',
      data: {
        labels: this.arrayOfLabelFrequenciasPortariasEstudante,
        datasets: [
          {
            label: '',
            // yAxisID: "frequencias",
            data: this.arrayOfQuantidadeFrequenciasPortariasEstudante,
            lineTension: 0.2,
            backgroundColor: this.arrayOfFrequenciaColors,
            borderColor: ['rgba(255, 159, 64, 0.5)'],
            borderWidth: 2,
          },
        ],
      },
      options: {
        legend: { display: true },
        title: { text: 'Frequencias da portaria', fontSize: 20, position: 'top', display: true },
        responsive: true,
        scales: {
          yAxes: [
            /* {
              id: "frequencias",
              ticks: {
                beginAtZero: true,
              },
              position: "left",
              type: "linear",
            } */
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

  // ################################## BLOCO DE MÉTODOS DISCIPLINARES ##################################//
  public carregarDadosDisciplinaresTurma(): void {
    this.feedbackUsuario = 'Carregando dados disciplinares dos estudantes, aguarde...';
    this.arrayOfOcorrenciasDisciplinaresEstudantes = [];
    this.disciplinarService.listarGraficoQuantitativoTipoPeriodo(this.prl_id_selecionado, this.trm_id_selecionada)
      .toPromise()
      .then((response: Response) => {
        this.arrayOfOcorrenciasDisciplinaresEstudantes = Object.values(response);
        this.carregarDadosFrequenciaPortariaTurma();
      }).catch((erro: Response) => {
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
      });
  }

  public gravarOcorrenciasEstudanteSelecionado(): void {
    const est_id = this.estudanteSelecionado.est_id;
    this.arrayOfQuantidadeOcorrenciasDisciplinaresEstudante = [];
    this.arrayOfTipoOcorrenciasDisciplinaresEstudante = [];
    this.arrayOfOcorrenciasDisciplinaresEstudantes.forEach(ocorrencia => {
      if (est_id == ocorrencia['est_id']) {
        this.arrayOfQuantidadeOcorrenciasDisciplinaresEstudante.push(ocorrencia['quantidade']);
        this.arrayOfTipoOcorrenciasDisciplinaresEstudante.push(ocorrencia['tipo_ocorrencia']);
        this.arrayOfOcorrenciasColors.push('rgba(219, 50, 54,0.75)');
      }
    });
    this.atualizarChartDisciplinarPeriodo();
  }

  public atualizarChartDisciplinarPeriodo(): void {
    const context = (<HTMLCanvasElement>document.getElementById('barChartDisciplinarPeriodo')).getContext('2d');
    if (this.barChartDisciplinarPeriodo != undefined)
      this.barChartDisciplinarPeriodo.destroy();

    this.barChartDisciplinarPeriodo = new Chart(context, {
      type: 'bar',
      data: {
        labels: this.arrayOfTipoOcorrenciasDisciplinaresEstudante,
        datasets: [
          {
            label: '',
            yAxisID: 'ocorrencias',
            data: this.arrayOfQuantidadeOcorrenciasDisciplinaresEstudante,
            lineTension: 0.2,
            backgroundColor: this.arrayOfOcorrenciasColors,
            borderColor: ['rgba(255, 159, 64, 0.5)'],
            borderWidth: 2,
          },
        ],
      },
      options: {
        legend: { display: false },
        title: { text: 'Ocorrencias disciplinares', fontSize: 20, position: 'top', display: true },
        responsive: true,
        scales: {
          yAxes: [
            {
              id: 'ocorrencias',
              ticks: {
                beginAtZero: true,
              },
              position: 'left',
              type: 'linear',
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

  // ################################## BLOCO DE MÉTODOS DE RENDIMENTO ##################################//
  public carregarResultadosAreaConhecimento(): void {
    this.feedbackUsuario = 'Carregando resultados por área de conhecimento, aguarde...';
    this.rendimentoService.listarRendimentoAreaConhecimentoTurmaPeriodo(
      this.trm_id_selecionada,
      this.prl_id_selecionado)
      .toPromise()
      .then((response: Response) => {
        this.arrayOfRendimentoAreaConhecimentoEstudantes = Object.values(response);
        this.feedbackUsuario = undefined;
      }).catch((erro: Response) => {
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
      });
  }

  public gravarMediasAreaConhecimentoEstudanteSelecionado(): void {
    this.arrayDadosAreaConhecimentoEstudanteSelecionado = [];
    this.arrayLabelsAreaConhecimentoEstudanteSelecionado = [];
    this.arrayColorsAreaConhecimentoEstudanteSelecionado = [];
    const est_id = this.estudanteSelecionado.est_id;
    this.arrayOfRendimentoAreaConhecimentoEstudantes.forEach(resultadoAreaConhecimento => {
      if (est_id == resultadoAreaConhecimento['est_id']) {
        this.arrayDadosAreaConhecimentoEstudanteSelecionado.push(resultadoAreaConhecimento['media']);
        this.arrayLabelsAreaConhecimentoEstudanteSelecionado.push(resultadoAreaConhecimento['area_conhecimento_abv']);
        this.arrayColorsAreaConhecimentoEstudanteSelecionado.push('rgba( 72, 133, 237,0.75)');
      }
    });
    this.atualizarChartMediasAreaConhecimento();
  }

  public usarMediaEscalaFixa(): void {
    if (this.escalaFixa == true) {
      this.escalaFixa = false;
      this.dataSetEscalaFixa = [];
    } else {
      this.escalaFixa = true;
      this.dataSetEscalaFixa = [0, 10];
    }
    this.atualizarChartMediasAreaConhecimento();
  }

  public atualizarChartMediasAreaConhecimento(): void {
    const context = (<HTMLCanvasElement>document.getElementById('radarChartMediaAreaConhecimento')).getContext('2d');
    if (this.radarChartMediaAreaConhecimento != undefined)
      this.radarChartMediaAreaConhecimento.destroy();

    this.radarChartMediaAreaConhecimento = new Chart(context, {
      type: 'radar',
      data: {
        labels: this.arrayLabelsAreaConhecimentoEstudanteSelecionado,
        datasets: [
          {
            label: '',
            data: this.arrayDadosAreaConhecimentoEstudanteSelecionado,
            lineTension: 0.2,
            backgroundColor: this.arrayColorsAreaConhecimentoEstudanteSelecionado,
            borderColor: ['rgba(255, 159, 64, 0.5)'],
            borderWidth: 2,
            pointRadius: 5,
            pointBackgroundColor: [
              'rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0.5)'],
          },
          {
            label: '',
            data: this.dataSetEscalaFixa,
            lineTension: 0.2,
            backgroundColor: ['rgba(255, 255, 255, 0.0)', 'rgba(255, 255, 255, 0.0)'],
            borderColor: ['rgba(255, 255, 255, 0.0)'],
            borderWidth: 2,
            pointRadius: 5,
          },
        ],
      },
      options: {
        legend: { display: false },
        title: { text: 'Média por área do conhecimento', fontSize: 20, position: 'top', display: true },
        responsive: true,
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

  public carregarResultadosTurma(): void {
    this.feedbackUsuario = 'Carregando notas dos estudantes, aguarde...';
    this.resultadosEstudantes = [];
    this.rendimentoService.listarRendimentoTurmaPeriodo(this.trm_id_selecionada, this.prl_id_selecionado)
      .toPromise().then((response: Response) => {
        const resultados_turma = Object.values(response);
        if (resultados_turma.length > 0) {
          let last_est_id: number = 0;
          let resultadoEstudante: ResultadoEstudante;
          if (resultados_turma.length == 0) {
            this.barChartnotaFaltasPeriodo.destroy();
            this.estudanteSelecionado.estudante = '';
          }
          resultados_turma.forEach(resultado => {
            const est_id: number = resultado['est_id'];
            if (est_id != last_est_id) {
              last_est_id = est_id;
              resultadoEstudante = new ResultadoEstudante();
              resultadoEstudante.est_id = last_est_id;
              resultadoEstudante.estudante = resultado['nome'];
              if (resultado['foto'] != '') {
                resultadoEstudante.foto = resultado['foto'];
              } else {
                resultadoEstudante.foto = '../../../../assets/images/noavatar.jpg';
              }
              this.resultadosEstudantes.push(resultadoEstudante);
            }
            if (est_id == last_est_id) {
              const notaFaltasDisciplinaEstudante = new NotaFaltasDisciplinaEstudante();
              notaFaltasDisciplinaEstudante.nota = resultado['nota'];
              notaFaltasDisciplinaEstudante.faltas = resultado['faltas'];
              notaFaltasDisciplinaEstudante.descricao = resultado['disciplina'];
              notaFaltasDisciplinaEstudante.descricao_abv = resultado['disciplina_abv'];
              resultadoEstudante.notaFaltasdisciplinas.push(notaFaltasDisciplinaEstudante);
            }
          });
          this.carregarDadosDisciplinaresTurma();
        } else {
          this.alertModalService.showAlertWarning('Sem registro de notas para período selecionado');
          this.limparDadosDetalhes();
          this.feedbackUsuario = undefined;
        }

      }).catch((erro: Response) => {
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
      });
  }

  public selecionarTipoGrafico(tipoGrafico: number): void {
    this.tipoGraficoAproveitamentoSelecionado = tipoGrafico;
    switch (this.tipoGraficoAproveitamentoSelecionado) {
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


  public limparDadosDetalhes(): void {
    const resultadoTemporarioEstudante = new ResultadoEstudante();
    resultadoTemporarioEstudante.estudante = '';
    resultadoTemporarioEstudante.est_id = 0;
    resultadoTemporarioEstudante.foto = '';
    resultadoTemporarioEstudante.notaFaltasdisciplinas = [];
    this.selecionarEstudante(resultadoTemporarioEstudante);

    if (this.barChartnotaFaltasPeriodo != undefined)
      this.barChartnotaFaltasPeriodo.destroy();

    if (this.radarChartMediaAreaConhecimento != undefined)
      this.radarChartMediaAreaConhecimento.destroy();

    if (this.barChartDisciplinarPeriodo != undefined)
      this.barChartDisciplinarPeriodo.destroy();

    if (this.pieChartFrequenciaPortariaPeriodo != undefined)
      this.pieChartFrequenciaPortariaPeriodo.destroy();
  }

  public selecionarEstudante(resultadoEstudante: ResultadoEstudante): void {
    this.estudanteSelecionado = resultadoEstudante;
    this.arrayOfLabelsNotaPeriodo = [];
    this.arrayOfDadosNotaPeriodo = [];
    this.arrayOfDadosFaltasPeriodo = [];
    this.arrayOfNotaColors = [];
    this.estudanteSelecionado.notaFaltasdisciplinas.forEach(resultado => {
      this.arrayOfLabelsNotaPeriodo.push(resultado['descricao_abv']);
      this.arrayOfDadosNotaPeriodo.push(resultado['nota']);
      this.arrayOfDadosFaltasPeriodo.push(resultado['faltas']);
      this.arrayOfFaltasColors.push('rgba( 72, 133, 237,0.75)');
      if (resultado['nota'] < this.notaDeCorte - 0.5) {
        this.arrayOfNotaColors.push('rgba(219, 50, 54,0.75)');
      } else if (resultado['nota'] < this.notaDeCorte) {
        this.arrayOfNotaColors.push('rgba(244, 194, 13,0.75)');
      } else {
        this.arrayOfNotaColors.push('rgba(60, 186, 84,0.75)');
      }
    });
    switch (this.tipoGraficoAproveitamentoSelecionado) {
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

  public atualizarChartNotaPeriodo(): void {
    const context = (<HTMLCanvasElement>document.getElementById('barChartnotaFaltasPeriodo')).getContext('2d');
    if (this.barChartnotaFaltasPeriodo != undefined)
      this.barChartnotaFaltasPeriodo.destroy();

    this.barChartnotaFaltasPeriodo = new Chart(context, {
      type: 'bar',
      data: {
        labels: this.arrayOfLabelsNotaPeriodo,
        datasets: [
          {
            label: '',
            yAxisID: 'notas',
            data: this.arrayOfDadosNotaPeriodo,
            lineTension: 0.2,
            backgroundColor: this.arrayOfNotaColors,
            borderColor: ['rgba(255, 159, 64, 0.5)'],
            borderWidth: 2,
          },
        ],
      },
      options: {
        legend: { display: false },
        title: { text: 'Aproveitamento', fontSize: 20, position: 'top', display: true },
        responsive: true,
        scales: {
          yAxes: [
            {
              id: 'notas',
              ticks: {
                beginAtZero: true,
                max: 10,
              },
              position: 'left',
              type: 'linear',
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

  public atualizarChartFaltasPeriodo(): void {
    const context = (<HTMLCanvasElement>document.getElementById('barChartnotaFaltasPeriodo')).getContext('2d');
    if (this.barChartnotaFaltasPeriodo != undefined)
      this.barChartnotaFaltasPeriodo.destroy();

    this.barChartnotaFaltasPeriodo = new Chart(context, {
      type: 'bar',
      data: {
        labels: this.arrayOfLabelsNotaPeriodo,
        datasets: [
          {
            label: 'Faltas',
            yAxisID: 'faltas',
            data: this.arrayOfDadosFaltasPeriodo,
            lineTension: 0.1,
            backgroundColor: this.arrayOfFaltasColors,
            borderColor: ['rgba(255, 159, 64, 0.5)'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        legend: { display: false },
        title: { text: 'Faltas', fontSize: 20, position: 'top', display: true },
        responsive: true,
        scales: {
          yAxes: [
            {
              id: 'faltas',
              ticks: {
                beginAtZero: true,
              },
              position: 'right',
              type: 'linear',
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

  public atualizarChartNotaFaltasPeriodo(): void {
    const context = (<HTMLCanvasElement>document.getElementById('barChartnotaFaltasPeriodo')).getContext('2d');
    if (this.barChartnotaFaltasPeriodo != undefined)
      this.barChartnotaFaltasPeriodo.destroy();

    this.barChartnotaFaltasPeriodo = new Chart(context, {
      type: 'bar',
      data: {
        labels: this.arrayOfLabelsNotaPeriodo,
        datasets: [
          {
            label: '',
            yAxisID: 'notas',
            data: this.arrayOfDadosNotaPeriodo,
            lineTension: 0.2,
            backgroundColor: this.arrayOfNotaColors,
            borderColor: ['rgba(255, 159, 64, 0.5)'],
            borderWidth: 2,
          },
          {
            label: '',
            yAxisID: 'faltas',
            data: this.arrayOfDadosFaltasPeriodo,
            lineTension: 0.1,
            backgroundColor: this.arrayOfFaltasColors,
            borderColor: ['rgba(255, 159, 64, 0.5)'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        legend: { display: false },
        title: { text: 'Aproveitamento e faltas', fontSize: 20, position: 'top', display: true },
        responsive: true,
        scales: {
          yAxes: [
            {
              id: 'notas',
              ticks: {
                beginAtZero: true,
                max: 10,
              },
              position: 'left',
              type: 'linear',
            },
            {
              id: 'faltas',
              ticks: {
                beginAtZero: true,
              },
              position: 'right',
              type: 'linear',
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

  public listarOcorrenciasEstudante(estudante: Object): void {
    this.arrayOfOcorrenciasEstudante = [];
    this.feedbackUsuario = 'Listando todas as ocorrencias disciplinares do estudantes, aguarde...';
    this.ocorrenciaService.listarDetalhes(estudante['est_id'], '2000-01-01', Utils.dataAtual())
      .toPromise().then((response: Response) => {
        this.feedbackUsuario = undefined;
        this.arrayOfOcorrenciasEstudante = Object.values(response);
      }).catch((erro: Response) => {
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
      });
  }

  public listarEstatisticaEntregaNotificacoes(estId: number): void {
    this.feedbackUsuario = 'Listando status de entrega de notificações, aguarde...';
    this.estudanteService.listarStatusEntregaMensagensEnviadas(estId).toPromise().then((response: Response) => {
      const estatisticaRetorno = Object.values(response);
      console.log(estatisticaRetorno);
      /* -- */
      this.arrayDeEstatisticaMensagensAtividades = estatisticaRetorno.filter((estatistica) => {
        return estatistica['tipo'] == 'atividade_extra_estudante';
      });
      const valoresAtividades = this.arrayDeEstatisticaMensagensAtividades.map((valor) => {
        return valor['quantidade'];
      });
      setTimeout(() => {
        this.atualizarChartEstatisticaEntregaAtividades(estId, valoresAtividades);
      }, 2000);


      /* -- */
      this.arrayDeEstatisticaMensagensComunicados = estatisticaRetorno.filter((estatistica) => {
        return estatistica['tipo'] == 'comunicado_diverso';
      });
      const valoresComunicados = this.arrayDeEstatisticaMensagensComunicados.map((valor) => {
        return valor['quantidade'];
      });
      setTimeout(() => {
        this.atualizarChartEstatisticaEntregaComunicados(estId, valoresComunicados);
      }, 2000);


      /* -- */
      this.arrayDeEstatisticaMensagensFrequencias = estatisticaRetorno.filter((estatistica) => {
        return estatistica['tipo'] == 'frequencia_portaria';
      });
      const valoresFrequencia = this.arrayDeEstatisticaMensagensFrequencias.map((valor) => {
        return valor['quantidade'];
      });
      setTimeout(() => {
        this.atualizarChartEstatisticaEntregaFrequencias(estId, valoresFrequencia);
      }, 2000);


      /* -- */
      this.arrayDeEstatisticaMensagensOcorrencias = estatisticaRetorno.filter((estatistica) => {
        return estatistica['tipo'] == 'ocorrencia_disciplinar';
      });
      const valoresOcorrencias = this.arrayDeEstatisticaMensagensOcorrencias.map((valor) => {
        return valor['quantidade'];
      });
      setTimeout(() => {
        this.atualizarChartEstatisticaEntregaOcorrencias(estId, valoresOcorrencias);
      }, 2000);

      setTimeout(() => {
        this.feedbackUsuario = undefined;
      }, 2000);

    }).catch((erro: Response) => {
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
    });
  }

  public atualizarChartEstatisticaEntregaAtividades(estId: number, valores: number[]): void {
    this.pieChartEstatisticaEntregaAtividades = new Chart('pieChartEstatisticaEntregaAtividades' + estId, {
      type: 'pie',
      data: {
        labels: ['Enviadas', 'Recebidas', 'Lidas'],
        datasets: [
          {
            label: '',
            data: valores,
            lineTension: 0.2,
            backgroundColor: ['rgba(120,144,156 ,1)', 'rgba(37,211,102 ,1 )', 'rgba(30,136,229 ,1)'],
            borderColor: ['rgba(255, 159, 64, 0.5)'],
            borderWidth: 2,
          },
        ],
      },
      options: {
        legend: { display: false },
        title: { text: 'Atividades', fontSize: 14, position: 'top', display: true },
        responsive: true,
        scales: {
          yAxes: [],
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

  public atualizarChartEstatisticaEntregaComunicados(estId: number, valores: number[]): void {
    this.pieChartEstatisticaEntregaComunicados = new Chart('pieChartEstatisticaEntregaComunicados' + estId, {
      type: 'pie',
      data: {
        labels: ['Enviadas', 'Recebidas', 'Lidas'],
        datasets: [
          {
            label: '',
            data: valores,
            lineTension: 0.2,
            backgroundColor: ['rgba(120,144,156 ,1)', 'rgba(37,211,102 ,1 )', 'rgba(30,136,229 ,1)'],
            borderColor: ['rgba(255, 159, 64, 0.5)'],
            borderWidth: 2,
          },
        ],
      },
      options: {
        legend: { display: false },
        title: { text: 'Comunicados', fontSize: 14, position: 'top', display: true },
        responsive: true,
        scales: {
          yAxes: [],
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

  public atualizarChartEstatisticaEntregaFrequencias(estId: number, valores: number[]): void {
    this.pieChartEstatisticaEntregaFrequencias = new Chart('pieChartEstatisticaEntregaFrequencias' + estId, {
      type: 'pie',
      data: {
        labels: ['Enviadas', 'Recebidas', 'Lidas'],
        datasets: [
          {
            label: '',
            data: valores,
            lineTension: 0.2,
            backgroundColor: ['rgba(120,144,156 ,1)', 'rgba(37,211,102 ,1 )', 'rgba(30,136,229 ,1)'],
            borderColor: ['rgba(255, 159, 64, 0.5)'],
            borderWidth: 2,
          },
        ],
      },
      options: {
        legend: { display: false },
        title: { text: 'Frequências', fontSize: 14, position: 'bottom', display: true },
        responsive: true,
        scales: {
          yAxes: [],
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

  public atualizarChartEstatisticaEntregaOcorrencias(estId: number, valores: number[]): void {
    this.pieChartEstatisticaEntregaOcorrencias = new Chart('pieChartEstatisticaEntregaOcorrencias' + estId, {
      type: 'pie',
      data: {
        labels: ['Enviadas', 'Recebidas', 'Lidas'],
        datasets: [
          {
            label: '',
            data: valores,
            lineTension: 0.2,
            backgroundColor: ['rgba(120,144,156 ,1)', 'rgba(37,211,102 ,1 )', 'rgba(30,136,229 ,1)'],
            borderColor: ['rgba(255, 159, 64, 0.5)'],
            borderWidth: 2,
          },
        ],
      },
      options: {
        legend: { display: false },
        title: { text: 'Ocorrências', fontSize: 14, position: 'bottom', display: true },
        responsive: true,
        scales: {
          yAxes: [],
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

}




