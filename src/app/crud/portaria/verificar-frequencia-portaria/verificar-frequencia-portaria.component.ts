import { Component, OnInit } from '@angular/core';
import { PortariaService } from '../portaria.service';
import { TurmaService } from '../../turma/turma.service';
import { EstudanteService } from '../../estudante/estudante.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FrequenciaPortaria } from './frequencia-portaria.model';
import { Chart } from "chart.js";
import { Utils } from '../../../shared/utils.shared';
import { Portaria } from '../portaria.model';

@Component({
  selector: 'ngx-verificar-frequencia-portaria',
  templateUrl: './verificar-frequencia-portaria.component.html',
  styleUrls: ['./verificar-frequencia-portaria.component.scss'],
  providers: [PortariaService, TurmaService, EstudanteService],
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
export class VerificarFrequenciaPortariaComponent implements OnInit {

  constructor(
    private portariaService: PortariaService,
    private turmaService: TurmaService,
    private estudanteService: EstudanteService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private router: Router) { }

  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public esc_id: number;
  public usr_id: number;
  public trm_id_selecionada: number;
  public portarias: Object[];
  public turmas: Object[];
  public anoAtual: number;
  public stringTurmaSelecionada: string = "Selecione uma turma";
  public estudantesTurmaSelecionada = new Array<FrequenciaPortaria>();
  public estudantesPresentesDataTurmaSelecionada: Object[];
  public data_selecionada: string;
  public dataAtual: string;
  public percentualFrequenciasEstudante: Object[];
  public estatisticasFrequenciaEstudantesTurma: Object[];
  public chartEstatisticaFrequencia: Chart;
  public dataRecenteUltimaPassagemPortaria: string = Utils.dataAtual();

  ngOnInit() {
    this.esc_id = parseInt(Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT));
    this.usr_id = parseInt(JSON.parse(Utils.decriptAtoB(localStorage.getItem("dados"), CONSTANTES.PASSO_CRIPT))[0].id);
    this.anoAtual = (new Date()).getFullYear();
    this.dataAtual = Utils.dataAtual();
    this.data_selecionada = this.dataAtual;
    this.verificarPassagemMaisRecente();
  }

  public verificarPassagemMaisRecente(): void {
    this.feedbackUsuario = "Verificando registro mais recente de passagem na portaria, aguarde...";
    this.portariaService.verificarPassagemMaisRecente(this.esc_id).toPromise().then((response: Response) => {
      if (Object.values(response).length > 0) {
        this.dataRecenteUltimaPassagemPortaria = Object.values(response)[0]["data"];
      }
    }).then(() => {
      this.listarPortarias();
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

  public sincronizarDadosPortarias(): void {
    this.portarias.forEach(elem => {
      const portaria = new Portaria();
      portaria.por_id = elem["por_id"];
      portaria.nome = elem["nome"];
      portaria.codigo = elem["codigo"];
      portaria.esc_id = elem["esc_id"];
      this.baixarDadosPortaria(portaria, this.dataRecenteUltimaPassagemPortaria);
    })
  }

  public atualizarData(event: Event): void {
    this.data_selecionada = (<HTMLInputElement>event.target).value;
  }

  public mostrarEstatisticaFrequencia(estudante: Object) {
    const dados = new Array<number>()
    const labels = new Array<string>()
    const est_id = estudante["id"];
    dados.push(estudante["presencas"]);
    dados.push(estudante["faltas"])
    labels.push("Presenças");
    labels.push("faltas");
    this.pieChartEstatisticaFrequencia(dados, labels, est_id);
  }

  public pieChartEstatisticaFrequencia(dados: number[], labels: string[], est_id: string): void {
    this.chartEstatisticaFrequencia = new Chart("chartEstatisticaFrequencia" + est_id, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [
          {
            data: dados,
            backgroundColor: ["rgba(50, 219, 54,0.5)", "rgba(219, 50, 54,0.5)"]
          }
        ]
      },
      options: {
        responsiveAnimationDuration: 400,
        maintainAspectRatio: true,
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

  public verificarFrequenciaEstudantesTurmaSelecionada(): void {
    this.feedbackUsuario = "Verificando estatisticas de frequencias, aguarde..."
    this.portariaService.verificarFrequenciaTurmaAnoLetivo(this.trm_id_selecionada, this.anoAtual, 0).toPromise().then((response: Response) => {
      this.estatisticasFrequenciaEstudantesTurma = Object.values(response);
      //Limpa registros estatisticos de frequencia
      this.estudantesTurmaSelecionada.forEach(elem => {
        this.estudantesTurmaSelecionada[this.estudantesTurmaSelecionada.indexOf(elem)].presencas = 0;
        this.estudantesTurmaSelecionada[this.estudantesTurmaSelecionada.indexOf(elem)].faltas = 0;
      })
      //Avalia os estudantes que estão presentes, mudan seu status presente para true.
      this.estudantesPresentesDataTurmaSelecionada = Object.values(response);
      this.estudantesTurmaSelecionada.forEach(elem => {
        const est_id_turma = elem.id;
        this.estatisticasFrequenciaEstudantesTurma.forEach(elem2 => {
          const est_id_estatistica = elem2["est_id"];
          if (est_id_turma == est_id_estatistica) {
            this.estudantesTurmaSelecionada[this.estudantesTurmaSelecionada.indexOf(elem)].presencas = elem2["presencas"];
            this.estudantesTurmaSelecionada[this.estudantesTurmaSelecionada.indexOf(elem)].faltas = elem2["faltas"];
          }
        })
      })
      this.feedbackUsuario = undefined;
    })
  }

  public verificarEstudantesPresentes(): void {
    this.feedbackUsuario = "Verificando frequencias, aguarde...";
    this.portariaService.listarPresentes(
      this.trm_id_selecionada,
      this.data_selecionada,
      0)
      .toPromise()
      .then((response: Response) => {
        //Reinicia os valores para uma nova comparação
        this.estudantesTurmaSelecionada.forEach(elem => {
          this.estudantesTurmaSelecionada[this.estudantesTurmaSelecionada.indexOf(elem)].presente = false;
        })
        //Avalia os estudantes que estão presentes, mudan seu status presente para true.
        this.estudantesPresentesDataTurmaSelecionada = Object.values(response);
        this.estudantesTurmaSelecionada.forEach(elem => {
          const est_id_turma = elem.id;
          this.estudantesPresentesDataTurmaSelecionada.forEach(elem2 => {
            const est_id_presente = elem2["est_id"];
            if (est_id_turma == est_id_presente) {
              this.estudantesTurmaSelecionada[this.estudantesTurmaSelecionada.indexOf(elem)].presente = true;
            }
          })
        })
      }).then(() => {
        this.verificarFrequenciaEstudantesTurmaSelecionada();
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

  public listarPortarias(): void {
    this.feedbackUsuario = "Carregando dados, aguarde...";
    this.portariaService.listar(this.esc_id)
      .toPromise()
      .then((response: Response) => {
        this.portarias = Object.values(response);
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
    this.turmaService.listarTodasAno(this.anoAtual, this.esc_id).toPromise().then((response: Response) => {
      this.turmas = Object.values(response);
      this.sincronizarDadosPortarias();
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
    this.stringTurmaSelecionada = (<HTMLInputElement>event.target).name;
    this.listarEstudantesPorTurmaId();
  }

  public listarEstudantesPorTurmaId(): void {
    this.estudantesTurmaSelecionada = [];
    this.feedbackUsuario = "Carregando estudantes, aguarde..."
    this.estudanteService.listarTurmaId(this.trm_id_selecionada).toPromise().then((response: Response) => {
      const estudantes: Object[] = Object.values(response);
      estudantes.forEach(estudante => {
        const estudanteFrequenciaPortaria = new FrequenciaPortaria();
        estudanteFrequenciaPortaria.foto = estudante["foto"];
        estudanteFrequenciaPortaria.id = estudante["id"];
        estudanteFrequenciaPortaria.matricula = estudante["matricula"];
        estudanteFrequenciaPortaria.nome = (<String>estudante["nome"])[0].toUpperCase() + (<String>estudante["nome"]).substr(1).toLowerCase();
        this.estudantesTurmaSelecionada.push(estudanteFrequenciaPortaria);
      })
      this.feedbackUsuario = undefined;
    }).then(() => {
      this.verificarEstudantesPresentes();
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

  public gerenciarPortaria(): void {
    this.router.navigate(["gerenciar-portaria"]);
  }

  /**
   *
   * @param portaria ID único da portaria
   * @param ultimaDataRegistrada Ultima data de registro adicionada ao sistema
   */
  public baixarDadosPortaria(portaria: Portaria, ultimoRegistro: string) {
    let arrayDeEntradas = new Array<Object>();
    let arrayDeSaidas = new Array<Object>();
    let arrayDeAtrasos = new Array<Object>();
    let arrayDeSemUniforme = new Array<Object>();
    const por_id = portaria["por_id"];
    const codigo_portaria = portaria["codigo"];
    this.feedbackUsuario = "Carregando entradas da portaria...";
    this.firebaseService.lerDadosFrequenciaEntradaPortaria(codigo_portaria, ultimoRegistro).then((querySnapshot: firebase.firestore.QuerySnapshot) => {

      querySnapshot.forEach(documento => {
        const data = documento.data()["data"];
        const hora = documento.data()["hora"];
        const matricula = documento.data()["matricula"];
        const firebaseDbKey = documento.id;
        arrayDeEntradas.push({ data: data, hora: hora, matricula: matricula, firebaseDbKey: firebaseDbKey });
      })
    }).then(() => {
      this.feedbackUsuario = "Carregando saídas da portaria...";
      this.firebaseService.lerDadosFrequenciaSaidaPortaria(codigo_portaria, ultimoRegistro).then((querySnapshot: firebase.firestore.QuerySnapshot) => {
        querySnapshot.forEach(documento => {
          const data = documento.data()["data"];
          const hora = documento.data()["hora"];
          const matricula = documento.data()["matricula"];
          const firebaseDbKey = documento.id;
          arrayDeSaidas.push({ data: data, hora: hora, matricula: matricula, firebaseDbKey: firebaseDbKey });
        })
      }).then(() => {
        this.inserirDadosDaPortariaBancoDeDados(arrayDeEntradas, arrayDeSaidas, arrayDeAtrasos, arrayDeSemUniforme, por_id);
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
    })
  }

  public inserirDadosDaPortariaBancoDeDados(entradas: Object[], saidas: Object[], atrasos: Object[], semUniforme: Object[], por_id: number) {
    this.feedbackUsuario = "Gravando entradas no banco de dados...";
    this.portariaService.inserirEntradas(por_id, entradas).toPromise()
      .then(() => {
        this.feedbackUsuario = "Gravando saídas no banco de dados...";
        this.portariaService.inserirSaidas(por_id, saidas).toPromise()
          .then(() => {
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


}
