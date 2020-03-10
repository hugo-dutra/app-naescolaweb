import { Component, OnInit } from '@angular/core';
import { AlertaService } from '../alerta.service';
import { OcorrenciaService } from '../../ocorrencia/ocorrencia.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';
import { AcessoComumService } from '../../../shared/acesso-comum/acesso-comum.service';

@Component({
  selector: 'ngx-receber-alerta-ocorrencia',
  templateUrl: './receber-alerta-ocorrencia.component.html',
  styleUrls: ['./receber-alerta-ocorrencia.component.scss'],
  providers: [AlertaService, OcorrenciaService],
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
export class ReceberAlertaOcorrenciaComponent implements OnInit {

  public dados_escola = new Array<Object>();
  public dados_usuario = new Array<Object>();
  public feedbackUsuario: string;
  public estado: string = 'visivel';
  public esc_id: number;
  public usr_id: number;
  public anoAtual: number;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public arrayOfRegrasAlertasUsuario: Array<Object>;
  public arrayOfOcorrenciasPeriodoConsiderado = new Array<Object>();
  public arrayOfOcorrenciasSelecionadas = new Array<Object>();
  public observacaoAlertaVerificado: string;

  constructor(
    private alertaService: AlertaService,
    private ocorrenciaService: OcorrenciaService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private acessoComumService: AcessoComumService,
    private router: Router) { }

  ngOnInit() {
    this.carregarDados();
    this.listarRegrasAlertasUsuario();
  }

  public carregarDados(): void {
    this.anoAtual = (new Date()).getFullYear();
    this.dados_escola = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados_escola'), CONSTANTES.PASSO_CRIPT))[0];
    this.dados_usuario = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados'), CONSTANTES.PASSO_CRIPT))[0];
    this.esc_id = parseInt(this.dados_escola['id'], 10);
    this.usr_id = parseInt(this.dados_usuario['id'], 10);
  }

  /**
   *
   */
  public listarRegrasAlertasUsuario(): void {
    this.feedbackUsuario = 'Carregando regras de alertas, aguarde...';
    this.alertaService.listarRegraAlertaUsuario(this.usr_id, this.esc_id).toPromise().then((response: Response) => {
      this.arrayOfRegrasAlertasUsuario = Object.values(response);
      this.listarAlertasOcorrencia();
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

  /**
   *
   */
  public listarAlertasOcorrencia(): void {
    this.feedbackUsuario = 'Procurando por ocorrências dentro das regras, aguarde...';
    this.arrayOfOcorrenciasPeriodoConsiderado = [];
    this.arrayOfOcorrenciasSelecionadas = [];
    let contaRequisicoes = 0;
    if (this.arrayOfRegrasAlertasUsuario.length === 0) {
      this.feedbackUsuario = undefined;
    }

    this.arrayOfRegrasAlertasUsuario.forEach(regraAlerta => {
      const esc_id = parseInt(regraAlerta['esc_id'], 10);
      const usr_id = this.usr_id;
      const tod_id = parseInt(regraAlerta['tod_id'], 10);
      const data_inicio = regraAlerta['data_inicio'];
      const data_fim = regraAlerta['data_fim'];
      this.ocorrenciaService.listarQuantidadeAlertaNaoVerificado(
        esc_id,
        usr_id,
        tod_id,
        data_inicio,
        data_fim)
        .toPromise()
        .then((response: Response) => {
          const ocorrenciasRecebias = Object.values(response);
          contaRequisicoes++;
          if (!this.verificarOcorrenciaEstudanteArrayOcorrencias(ocorrenciasRecebias)) {
            this.arrayOfOcorrenciasPeriodoConsiderado.push(...ocorrenciasRecebias);
          }
          if (contaRequisicoes === this.arrayOfRegrasAlertasUsuario.length) {
            this.avaliarOcorrenciasDentroRegrasAlertas();
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
    });
  }

  /**
   *
   * @param ocorrenciasRecebida
   */
  public verificarOcorrenciaEstudanteArrayOcorrencias(ocorrenciasRecebida: Object[]): boolean {
    let retorno = false;
    this.arrayOfOcorrenciasPeriodoConsiderado.forEach(ocorrenciaExistente => {
      ocorrenciasRecebida.forEach(ocorrencia => {
        if (ocorrenciaExistente['ocd_id'] === ocorrencia['ocd_id']) {
          retorno = true;
        }
      });
    });
    return retorno;
  }

  /**
   *
   */
  public avaliarOcorrenciasDentroRegrasAlertas(): void {
    this.feedbackUsuario = undefined;
    this.arrayOfRegrasAlertasUsuario.forEach(regraAlerta => {
      const valor_referencia = parseInt(regraAlerta['valor_referencia'], 10);
      const operador = regraAlerta['operador'];
      const tod_id = regraAlerta['tod_id'];
      this.arrayOfOcorrenciasPeriodoConsiderado.forEach(ocorrencia => {
        const quantidadeOcorrenciasDeTipo = parseInt(ocorrencia['quantidade'], 10);
        switch (operador) {
          case 'menor': {
            if (quantidadeOcorrenciasDeTipo < valor_referencia && ocorrencia['tod_id'] === tod_id) {
              this.arrayOfOcorrenciasSelecionadas.push(ocorrencia);
              this.acessoComumService.emitirAlertaOcorrenciaDisciplinar.emit(
                Object.values(this.arrayOfOcorrenciasSelecionadas));
            }
            break;
          }
          case 'menor ou igual': {
            if (quantidadeOcorrenciasDeTipo <= valor_referencia && ocorrencia['tod_id'] === tod_id) {
              this.arrayOfOcorrenciasSelecionadas.push(ocorrencia);
              this.acessoComumService.emitirAlertaOcorrenciaDisciplinar.emit(
                Object.values(this.arrayOfOcorrenciasSelecionadas));
            }
            break;
          }
          case 'igual': {
            if (quantidadeOcorrenciasDeTipo === valor_referencia && ocorrencia['tod_id'] === tod_id) {
              this.arrayOfOcorrenciasSelecionadas.push(ocorrencia);
              this.acessoComumService.emitirAlertaOcorrenciaDisciplinar.emit(
                Object.values(this.arrayOfOcorrenciasSelecionadas));
            }
            break;
          }
          case 'maior ou igual': {
            if (quantidadeOcorrenciasDeTipo >= valor_referencia && ocorrencia['tod_id'] === tod_id) {
              this.arrayOfOcorrenciasSelecionadas.push(ocorrencia);
              this.acessoComumService.emitirAlertaOcorrenciaDisciplinar.emit(
                Object.values(this.arrayOfOcorrenciasSelecionadas));
            }
            break;
          }
          case 'maior': {
            if (quantidadeOcorrenciasDeTipo > valor_referencia && ocorrencia['tod_id'] === tod_id) {
              this.arrayOfOcorrenciasSelecionadas.push(ocorrencia);
              this.acessoComumService.emitirAlertaOcorrenciaDisciplinar.emit(
                Object.values(this.arrayOfOcorrenciasSelecionadas));
            }
            break;
          }
          case 'diferente': {
            if (quantidadeOcorrenciasDeTipo !== valor_referencia && ocorrencia['tod_id'] === tod_id) {
              this.arrayOfOcorrenciasSelecionadas.push(ocorrencia);
              this.acessoComumService.emitirAlertaOcorrenciaDisciplinar.emit(
                Object.values(this.arrayOfOcorrenciasSelecionadas));
            }
            break;
          }
          default:
            break;
        }
      });
    });
  }

  /**
   *
   * @param event
   */
  public atualizarObservacao(event: Event): void {
    this.observacaoAlertaVerificado = (<HTMLInputElement>event.target).value;
  }

  /**
   *
   * @param alertaOcorrencia
   */
  public tratarAlertaOcorrencia(alertaOcorrencia: Object): void {
    const est_id = parseInt(alertaOcorrencia['est_id'], 10);
    const tod_id = parseInt(alertaOcorrencia['tod_id'], 10);
    const usr_id = this.usr_id;
    const esc_id = this.esc_id;
    const data_verificacao = Utils.now();
    const data_inicio_considerado = (alertaOcorrencia['data_inicio_considerado']);
    const data_fim_considerado = (alertaOcorrencia['data_fim_considerado']);
    const observacao = this.observacaoAlertaVerificado;
    let oov_id = 0;
    this.feedbackUsuario = 'Gravando informações, aguarde...';

    this.alertaService.inserirObservacaoAlertaOcorrenciaVerificada(data_verificacao, observacao)
      .toPromise().then((response: Response) => {
        oov_id = Object.values(response)[0]['oov_id'];
      }).then(() => {
        this.feedbackUsuario = 'finalizando...';
        this.alertaService.inserirAlertaOcorrenciaVerificada(
          est_id,
          tod_id,
          usr_id,
          esc_id,
          data_inicio_considerado,
          data_fim_considerado,
          oov_id,
        ).toPromise()
          .then((response: Response) => {
            this.feedbackUsuario = undefined;
            this.listarAlertasOcorrencia();
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
      });
  }
}
