import { Component, OnInit } from '@angular/core';
import { OcorrenciaService } from '../../../crud/ocorrencia/ocorrencia.service';
import { TurmaService } from '../../../crud/turma/turma.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-calcular-avaliacao-social',
  templateUrl: './calcular-avaliacao-social.component.html',
  styleUrls: ['./calcular-avaliacao-social.component.scss'],
  providers: [OcorrenciaService, TurmaService],
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
export class CalcularAvaliacaoSocialComponent implements OnInit {

  public feedbackUsuario: string;
  public feedbackPopup: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public arrayOfTurmas: Array<Object>;
  public arrayOfEstudantesAvaliacaoSocial: Array<Object>;
  public data_inicio_padrao: string;
  public data_fim_padrao: string;
  public anoAtual: number;
  public esc_id: number;
  public trm_id: number;
  public total_avaliacao_social: number;
  public stringTurmaSelecionada: string = "Selecione uma turma";
  public arrayOfDetalhesOcorrencias: Array<Object>;

  constructor(
    private ocorrenciaService: OcorrenciaService,
    private turmaService: TurmaService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router) { }



  ngOnInit() {
    this.inicializarVariaveis();
    this.listarTurmas();
  }

  public inicializarVariaveis(): void {
    this.data_inicio_padrao = new Date().getFullYear().toString() + "-01-01";
    this.data_fim_padrao =
      new Date().getFullYear().toString() +
      "-" +
      ("0" + (new Date().getMonth() + 1)).slice(-2).toString() +
      "-" +
      ("0" + new Date().getDate()).slice(-2).toString();
    this.anoAtual = (new Date()).getFullYear();
    this.esc_id = parseInt(Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT));
    this.total_avaliacao_social = 1;
  }

  public listarTurmas(): void {
    this.feedbackUsuario = "Carregando turmas, aguarde...";
    this.turmaService.listarTodasAno(this.anoAtual, this.esc_id).toPromise().then((response: Response) => {
      this.arrayOfTurmas = Object.values(response)
      this.feedbackUsuario = undefined;
    }).catch((erro: Response) => {
      this.feedbackUsuario = undefined;
      //Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      //registra log de erro no firebase usando serviço singlenton
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
      //Gravar erros no analytics
      Utils.gravarErroAnalytics(JSON.stringify(erro));
      //Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
    })
  }

  public calcularAvaliacaoSocial(): void {
    this.feedbackUsuario = "Calculando ponto social, aguarde...";
    this.ocorrenciaService.calcularAvaliacaoSocial(
      this.trm_id,
      this.data_inicio_padrao,
      this.data_fim_padrao,
      this.total_avaliacao_social).toPromise().then((response: Response) => {
        this.arrayOfEstudantesAvaliacaoSocial = Object.values(response)
        this.feedbackUsuario = undefined;
      }).catch((erro: Response) => {
        this.feedbackUsuario = undefined;
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
        //Gravar erros no analytics
        Utils.gravarErroAnalytics(JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
      })
  }

  public selecionarTurma(event: Event): void {
    this.trm_id = parseInt((<HTMLInputElement>event.target).id);
    this.stringTurmaSelecionada = (<HTMLInputElement>event.target).name;
  }

  public modificarMaximaAvaliacaoSocial(event: Event): void {
    this.total_avaliacao_social = parseFloat((<HTMLInputElement>event.target).value);
  }

  public atualizarData(event: Event): void {
    let nomeComponente = (<HTMLInputElement>event.target).name;
    if (nomeComponente == "data_inicio") {
      this.data_inicio_padrao = (<HTMLInputElement>event.target).value;
    } else {
      this.data_fim_padrao = (<HTMLInputElement>event.target).value;
    }
  }

  public detalharOcorrenciasEstudante(est_id: number): void {
    this.feedbackPopup = "Listando ocorrencias, aguarde...";
    this.ocorrenciaService.listarDetalhes(est_id, this.data_inicio_padrao, this.data_fim_padrao).toPromise().then((response: Response) => {
      this.feedbackPopup = undefined;
      this.arrayOfDetalhesOcorrencias = [];
      this.arrayOfDetalhesOcorrencias = Object.values(response);
    }).catch((erro: Response) => {
      this.feedbackUsuario = undefined;
      //Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      //registra log de erro no firebase usando serviço singlenton
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
      //Gravar erros no analytics
      Utils.gravarErroAnalytics(JSON.stringify(erro));
      //Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
    })
  }
}
