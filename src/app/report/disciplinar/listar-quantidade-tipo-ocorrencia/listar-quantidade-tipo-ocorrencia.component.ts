import { Component, OnInit } from '@angular/core';
import { OcorrenciaService } from '../../../crud/ocorrencia/ocorrencia.service';
import { TipoOcorrenciaDisciplinarService } from '../../../crud/tipo-ocorrencia-disciplinar/tipo-ocorrencia-disciplinar.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { Router } from '@angular/router';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Utils } from '../../../shared/utils.shared';
import { HintService } from 'angular-custom-tour';
import { AcessoComumService } from '../../../shared/acesso-comum/acesso-comum.service';

@Component({
  selector: 'ngx-listar-quantidade-tipo-ocorrencia',
  templateUrl: './listar-quantidade-tipo-ocorrencia.component.html',
  styleUrls: ['./listar-quantidade-tipo-ocorrencia.component.scss'],
  providers: [OcorrenciaService, TipoOcorrenciaDisciplinarService, HintService],
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
export class ListarQuantidadeTipoOcorrenciaComponent implements OnInit {

  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public data_inicio_padrao: string;
  public data_fim_padrao: string;
  public esc_id: number;
  public tod_id: number;
  public arrayOfTiposOcorrencia: Array<Object>;
  public arrayOfOcorrenias: Array<Object>;
  public tipoOrdenamento: string = 'd';

  constructor(
    private ocorrenciaService: OcorrenciaService,
    private alertModalService: AlertModalService,
    private router: Router,
    private firebaseService: FirebaseService,
    private tipoOcorrenciaDisciplinarService: TipoOcorrenciaDisciplinarService,
    private hintService: HintService,
    private acessoComumService: AcessoComumService,
  ) { }

  ngOnInit() {
    this.esc_id = parseInt(Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT));
    this.inicializarDatas();
    this.listarTipoOcorrencia();
    this.subscribeTour();
  }

  public subscribeTour(): void {
    this.acessoComumService.emitirAlertaInicioTour.subscribe(() => {
      this.hintService.initialize({ elementsDisabled: false });
    })
  }

  public inicializarDatas(): void {
    this.data_inicio_padrao = new Date().getFullYear().toString() + "-01-01";
    this.data_fim_padrao =
      new Date().getFullYear().toString() +
      "-" +
      ("0" + (new Date().getMonth() + 1)).slice(-2).toString() +
      "-" +
      ("0" + new Date().getDate()).slice(-2).toString();
  }

  public selecionarTipoOrdenamento(event: Event): void {
    this.tipoOrdenamento = (<HTMLInputElement>event.target).value;
  }

  public gravarDataInicio(event: Event): void {
    this.data_inicio_padrao = (<HTMLInputElement>(event.target)).value;
  }

  public gravarDataFim(event: Event): void {
    this.data_fim_padrao = (<HTMLInputElement>(event.target)).value;
  }

  public selecionarTipoDeOcorrencia(event: Event): void {
    this.tod_id = parseInt((<HTMLInputElement>event.target).value);
  }

  public listarTipoOcorrencia(): void {
    this.feedbackUsuario = 'Listando tipos de ocorrência, aguarde...';
    this.tipoOcorrenciaDisciplinarService.listar(10000, 0, true, this.esc_id).toPromise().then((response: Response) => {
      this.feedbackUsuario = undefined;
      this.arrayOfTiposOcorrencia = Object.values(response);
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

  public listarOcorrenciaPorTipo(): void {
    this.feedbackUsuario = 'Listando ocorrências do tipo selecionado, aguarde...';
    this.ocorrenciaService.listarQuantidadeTipoPeriodo(this.tod_id, this.data_inicio_padrao, this.data_fim_padrao, this.tipoOrdenamento)
      .toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = undefined;
        this.arrayOfOcorrenias = Object.values(response);

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
