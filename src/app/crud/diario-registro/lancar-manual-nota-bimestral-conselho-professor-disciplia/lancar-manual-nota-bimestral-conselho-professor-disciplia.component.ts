import { Component, OnInit } from '@angular/core';
import { EstudanteService } from '../../estudante/estudante.service';
import { PeriodoLetivoService } from '../../periodo-letivo/periodo-letivo.service';
import { DiarioRegistroService } from '../diario-registro.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-lancar-manual-nota-bimestral-conselho-professor-disciplia',
  templateUrl: './lancar-manual-nota-bimestral-conselho-professor-disciplia.component.html',
  styleUrls: ['./lancar-manual-nota-bimestral-conselho-professor-disciplia.component.scss'],
  providers: [EstudanteService, PeriodoLetivoService, DiarioRegistroService],
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
export class LancarManualNotaBimestralConselhoProfessorDiscipliaComponent implements OnInit {

  public dsp_id: number;
  public trm_id: number;
  public estado: string = "visivel";
  public feedbackUsuario: string;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public arrayOfEstudantesLancamentoNota: Array<object>;
  public periodosLetivos: Object[];
  public anoAtual: number;
  public stringPeriodoSelecionado: string = "Selecione um periodo";
  public prl_id: number = undefined;
  public stringSerie: string;
  public stringTurma: string;
  public stringTurno: string;
  public stringEtapa: string;
  public stringInformacoes: string = "";
  public arrayOfEstudantesNotas = new Array<Object>();
  public arrayOfEstudantesNotasFaltas = new Array<Object>();
  public esc_id: number;


  constructor(
    private activeroute: ActivatedRoute,
    private estudanteService: EstudanteService,
    private firebaseService: FirebaseService,
    private alertModalService: AlertModalService,
    private router: Router,
    private route: ActivatedRoute,
    private periodoLetivoService: PeriodoLetivoService,
    private diarioRegistroService: DiarioRegistroService
  ) { }

  ngOnInit() {
    this.activeroute.queryParams.subscribe((Objeto: any) => {
      this.dsp_id = parseInt(Objeto["dsp_id"]);
      this.trm_id = parseInt(Objeto["trm_id"]);
      this.stringSerie = Objeto["serie"];
      this.stringTurma = Objeto["turma"];
      this.stringTurno = Objeto["turno"];
      this.stringEtapa = Objeto["etapa"];
    });
    this.listarEstudantesTurmaSelecionada();
    this.anoAtual = (new Date()).getFullYear();
    this.stringInformacoes = `${this.stringSerie} ${this.stringTurma} ${this.stringTurno}. - ${this.stringEtapa}`;
    this.esc_id = Utils.pegarDadosEscola()['id'];
  }

  public listarEstudantesTurmaSelecionada(): void {
    this.feedbackUsuario = "Carregando lista de estudantes, aguarde..."
    this.estudanteService.listarTurmaId(this.trm_id).toPromise().then((response: Response) => {
      this.arrayOfEstudantesLancamentoNota = Object.values(response);
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
      this.feedbackUsuario = undefined
    })
  }

  public carregarPeriodoLetivo(): void {
    this.feedbackUsuario = "Listando períodos letivos...";
    this.periodoLetivoService.listarPorAno(this.anoAtual).toPromise().then((response: Response) => {
      this.periodosLetivos = Object.values(response);
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
      this.feedbackUsuario = undefined
    });
  }

  public gravarNotasFaltas(): void {
    this.arrayOfEstudantesNotasFaltas = [];
    const arrayOfdadosNotasFaltas = Array.from(document.getElementsByTagName('input'));
    let est_id: number = undefined;
    let nota: number = undefined;
    let faltas: number = undefined;

    if (this.prl_id != undefined) {
      arrayOfdadosNotasFaltas.forEach(elem => {
        est_id = parseInt(elem.name);
        if (arrayOfdadosNotasFaltas.indexOf(elem) % 2 == 0) {
          nota = parseFloat(elem.value);
        } else {
          faltas = parseInt(elem.value);
        }

        if (est_id != undefined && nota != undefined && faltas != undefined) {
          this.arrayOfEstudantesNotasFaltas.push({
            prl_id: this.prl_id,
            est_id: est_id,
            dsp_id: this.dsp_id,
            nota: nota,
            faltas: faltas,
            anoAtual: this.anoAtual,
            esc_id: this.esc_id
          });
          est_id = undefined;
          nota = undefined;
          faltas = undefined;
        }
      })
      const validandoEntrada = this.validarDadosNotasFaltas(this.arrayOfEstudantesNotasFaltas);
      if (validandoEntrada.permitido) {
        this.feedbackUsuario = "Gravando notas bimestrais, aguarde...";
        this.diarioRegistroService.gravarLancamentoPeriodoLetivoManual(this.arrayOfEstudantesNotasFaltas).toPromise().then((response: Response) => {
          this.feedbackUsuario = undefined;
          this.alertModalService.showAlertSuccess('Registros inseridos com sucesso!');
        }).catch((erro: Response) => {
          //Mostra modal
          this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
          //registra log de erro no firebase usando serviço singlenton
          this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
          //Gravar erros no analytics
          Utils.gravarErroAnalytics(JSON.stringify(erro));
          //Caso token seja invalido, reenvia rota para login
          Utils.tratarErro({ router: this.router, response: erro });
          this.feedbackUsuario = undefined
        })
      } else {
        this.alertModalService.showAlertWarning(`${validandoEntrada.mensagem}`);
      }
    } else {
      this.alertModalService.showAlertWarning("Selecione um período letivo!");
    }
  }

  public selecionarPeriodo(event: Event, periodo: Object): void {
    this.prl_id = parseInt((<HTMLInputElement>event.target).id);
    this.stringPeriodoSelecionado = (<HTMLInputElement>event.target).name;
  }

  public validarDadosNotasFaltas(arrayNotasFaltas: Object[]): { permitido: boolean, mensagem: string } {
    for (let i = 0; i < arrayNotasFaltas.length; i++) {
      const notaFalta = arrayNotasFaltas[i];
      if (parseFloat(notaFalta["nota"]) < 0 || parseFloat(notaFalta["nota"]) > 10) {
        return { permitido: false, mensagem: "Existem valores de nota fora do intervalo. Informe um valor entre 0 e 10." };
      }
      if (parseFloat(notaFalta["faltas"]) < 0) {
        return { permitido: false, mensagem: "Existem valores de falta fora do intervalo." };
      }
    }
    return { permitido: true, mensagem: "Mensagem enviada pelo método" };
  }



  public listarTurmaDisciplinaProfessor(): void {
    this.router.navigate([`${this.route.parent.routeConfig.path}/listar-turma-disciplina-professor`]);
  }

}
