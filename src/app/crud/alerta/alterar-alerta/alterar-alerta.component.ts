import { Component, OnInit } from '@angular/core';
import { AlertaService } from '../alerta.service';
// tslint:disable-next-line: max-line-length
import { TipoOcorrenciaDisciplinarService } from '../../tipo-ocorrencia-disciplinar/tipo-ocorrencia-disciplinar.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-alterar-alerta',
  templateUrl: './alterar-alerta.component.html',
  styleUrls: ['./alterar-alerta.component.scss'],
  providers: [AlertaService, TipoOcorrenciaDisciplinarService],
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
export class AlterarAlertaComponent implements OnInit {

  public dados_escola = new Array<Object>();
  public dados_usuario = new Array<Object>();
  public feedbackUsuario: string;
  public estado: string = 'visivel';
  public esc_id: number;
  public usr_id: number;
  public id: number;
  public anoAtual: number;

  public regra: Object;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;

  public arrayOfOperadorAlerta: Array<Object>;
  public arrayOfTiposOcorrenciasDisciplinares: Array<Object>;
  public stringDeTipoDeOcorrencia = 'Tipo de ocorrĂȘncia';
  public tod_id: number;
  public opa_id: number;
  public stringDeOperadorDeAlerta = 'Operadores';
  public dataInicial: string;
  public dataFinal: string;
  public dataCriacao: string;
  public quantidadeDeOcorrencias: number;
  public dataAtual: string;

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private alertaService: AlertaService,
    private tipoOcorrenciaDisciplinarService: TipoOcorrenciaDisciplinarService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe((regra: Object) => {
      this.regra = JSON.parse(regra['regra']);
    });
    this.carregarDados();
    this.listarOperadorAlerta();
  }

  public alterarAlerta(): void {
    this.feedbackUsuario = 'Alterando alerta, aguarde...';
    this.alertaService.alterarRegraAlerta(
      this.id, this.tod_id, this.opa_id,
      this.quantidadeDeOcorrencias, new Date(this.dataInicial + ' 00:00:00'), new Date(this.dataFinal + ' 00:00:00'),
      new Date(this.dataCriacao + ' 00:00:00'), this.esc_id, this.usr_id)
      .toPromise().then(() => {
        this.feedbackUsuario = undefined;
        this.listarAlertas();
      }).catch((erro: Response) => {
        // Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        // registra log de erro no firebase usando serviĂ§o singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`,
          JSON.stringify(erro));
        // Gravar erros no analytics
        Utils.gravarErroAnalytics(JSON.stringify(erro));
        // Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      });
  }

  public listarAlertas(): void {
    this.router.navigate([`${this.activeRoute.parent.routeConfig.path}/listar-alerta`]);
  }

  public carregarDados(): void {
    this.dados_escola = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados_escola'), CONSTANTES.PASSO_CRIPT))[0];
    this.dados_usuario = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados'), CONSTANTES.PASSO_CRIPT))[0];
    this.esc_id = parseInt(this.dados_escola['id'], 10);
    this.usr_id = parseInt(this.dados_usuario['id'], 10);
    this.id = parseInt(this.regra['ral_id'], 10);
    this.tod_id = parseInt(this.regra['tod_id'], 10);
    this.opa_id = parseInt(this.regra['opa_id'], 10);
    this.quantidadeDeOcorrencias = parseInt(this.regra['valor_referencia'], 10);
    this.dataInicial = (<string>this.regra['data_inicio']).split('T')[0];
    this.dataFinal = (<string>this.regra['data_fim']).split('T')[0];
    this.dataCriacao = (<string>this.regra['data_criacao']).split('T')[0];
    this.stringDeTipoDeOcorrencia = this.regra['tipo_ocorrencia'];
    this.stringDeOperadorDeAlerta = this.regra['operador'];
  }

  public listarTiposDeOcorrenciasDisciplinares(): void {
    this.feedbackUsuario = 'Carregando tipos de ocorrĂȘncias, aguarde...';
    this.tipoOcorrenciaDisciplinarService.listar(50000, 0, true, this.esc_id).toPromise().then((response: Response) => {
      this.feedbackUsuario = undefined;
      this.arrayOfTiposOcorrenciasDisciplinares = Object.values(response);
    }).catch((erro: Response) => {
      // Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      // registra log de erro no firebase usando serviĂ§o singlenton
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`,
        JSON.stringify(erro));
      // Gravar erros no analytics
      Utils.gravarErroAnalytics(JSON.stringify(erro));
      // Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
      this.feedbackUsuario = undefined;
    });
  }

  public listarOperadorAlerta(): void {
    this.feedbackUsuario = 'Carregando informaĂ§Ă”es, aguarde...';
    this.alertaService.listarOperadorAlerta().toPromise().then((response: Response) => {
      this.arrayOfOperadorAlerta = Object.values(response);
      this.listarTiposDeOcorrenciasDisciplinares();
    }).catch((erro: Response) => {
      // Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      // registra log de erro no firebase usando serviĂ§o singlenton
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`,
        JSON.stringify(erro));
      // Gravar erros no analytics
      Utils.gravarErroAnalytics(JSON.stringify(erro));
      // Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
      this.feedbackUsuario = undefined;
    });
  }

  public gravarQuantidadeDeOcorrencias(event: Event): void {
    this.quantidadeDeOcorrencias = parseInt((<HTMLInputElement>event.target).value, 10);
  }

  public gravarDataInicial(event: Event): void {
    this.dataInicial = (<HTMLInputElement>event.target).value;
  }

  public gravarDataFinal(event: Event): void {
    this.dataFinal = (<HTMLInputElement>event.target).value;
  }

  public selecionarTipoOcorrenciaDisciplinar(event: Event): void {
    this.tod_id = parseInt((<HTMLInputElement>event.target).value, 10);
  }

  public selecionarOperadorDeAlerta(event: Event): void {
    this.opa_id = parseInt((<HTMLInputElement>event.target).value, 10);
  }

}
