import { Component, OnInit } from '@angular/core';
import { AlertaService } from '../alerta.service';
import { TipoOcorrenciaDisciplinarService } from '../../tipo-ocorrencia-disciplinar/tipo-ocorrencia-disciplinar.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { Router } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-inserir-alerta',
  templateUrl: './inserir-alerta.component.html',
  styleUrls: ['./inserir-alerta.component.scss'],
  providers: [AlertaService, TipoOcorrenciaDisciplinarService],
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
export class InserirAlertaComponent implements OnInit {

  public dados_escola = new Array<Object>();
  public dados_usuario = new Array<Object>();
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public esc_id: number;
  public usr_id: number;
  public anoAtual: number;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public arrayOfOperadorAlerta: Array<Object>;
  public arrayOfTiposOcorrenciasDisciplinares: Array<Object>;
  public stringDeTipoDeOcorrencia = "Tipo de ocorrência";
  public tod_id: number = 0;
  public opa_id: number = 0;
  public stringDeOperadorDeAlerta = "Operadores";
  public dataInicial: string;
  public dataFinal: string;
  public quantidadeDeOcorrencias: number;
  public dataAtual: string;

  constructor(
    private alertaService: AlertaService,
    private tipoOcorrenciaDisciplinarService: TipoOcorrenciaDisciplinarService,
    private router: Router,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService
  ) { }

  ngOnInit() {
    this.carregarDados();
    this.listarOperadorAlerta();
  }

  public limparComponentes(): void {
    this.stringDeTipoDeOcorrencia = "Tipo de ocorrência";
    this.stringDeOperadorDeAlerta = "Operadores";
    this.tod_id = 0;
    this.opa_id = 0;
    this.quantidadeDeOcorrencias = 0;
    this.dataInicial = undefined;
    this.dataFinal = undefined;
    this.inicializarDatas();
  }

  public inserirAlerta(): void {
    if (this.validarInserirAlerta()) {
      this.feedbackUsuario = "Criando nova regra de alerta, aguarde..."
      this.alertaService.inserirRegraAlerta(
        this.quantidadeDeOcorrencias, this.opa_id, this.tod_id,
        this.usr_id, this.esc_id, this.dataAtual,
        this.dataInicial, this.dataFinal)
        .toPromise().then((response: Response) => {
          this.feedbackUsuario = undefined;
          this.alertModalService.showAlertSuccess('Operação finalizada com sucesso!');
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
    } else {
      this.alertModalService.showAlertWarning("Selecione tipo de ocorrência e operador");
    }
  }

  public validarInserirAlerta(): boolean {
    if (this.tod_id > 0 && this.opa_id > 0) {
      return true
    }
    return false;
  }

  public gravarQuantidadeDeOcorrencias(event: Event): void {
    this.quantidadeDeOcorrencias = parseInt((<HTMLInputElement>event.target).value);
  }

  public gravarDataInicial(event: Event): void {
    this.dataInicial = (<HTMLInputElement>event.target).value;
  }

  public gravarDataFinal(event: Event): void {
    this.dataFinal = (<HTMLInputElement>event.target).value;
  }

  public inicializarDatas() {
    this.dataInicial = new Date().getFullYear().toString() + "-01-01";
    this.dataFinal =
      new Date().getFullYear().toString() +
      "-" +
      ("0" + (new Date().getMonth() + 1)).slice(-2).toString() +
      "-" +
      ("0" + new Date().getDate()).slice(-2).toString();

    this.dataAtual =
      new Date().getFullYear().toString() +
      "-" +
      ("0" + (new Date().getMonth() + 1)).slice(-2).toString() +
      "-" +
      ("0" + new Date().getDate()).slice(-2).toString();
  }

  public selecionarTipoOcorrenciaDisciplinar(event: Event): void {
    this.tod_id = parseInt((<HTMLInputElement>event.target).value);
  }

  public selecionarOperadorDeAlerta(event: Event): void {
    this.opa_id = parseInt((<HTMLInputElement>event.target).value);
  }

  public listarTiposDeOcorrenciasDisciplinares(): void {
    this.feedbackUsuario = "Carregando tipos de ocorrências, aguarde...";
    this.tipoOcorrenciaDisciplinarService.listar(50000, 0, true, this.esc_id).toPromise().then((response: Response) => {
      this.feedbackUsuario = undefined;
      this.arrayOfTiposOcorrenciasDisciplinares = Object.values(response);
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

  public carregarDados(): void {
    this.anoAtual = (new Date()).getFullYear();
    this.dados_escola = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados_escola'), CONSTANTES.PASSO_CRIPT))[0];
    this.dados_usuario = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados'), CONSTANTES.PASSO_CRIPT))[0];
    this.esc_id = parseInt(this.dados_escola['id'], 10);
    this.usr_id = parseInt(this.dados_usuario['id'], 10);
    this.inicializarDatas();
  }

  public listarOperadorAlerta(): void {
    this.feedbackUsuario = "Carregando informações, aguarde...";
    this.alertaService.listarOperadorAlerta().toPromise().then((response: Response) => {
      this.arrayOfOperadorAlerta = Object.values(response);
      this.listarTiposDeOcorrenciasDisciplinares();
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

  public gerenciarAlerta(): void {
    this.router.navigate(['gerenciar-alerta-ocorrencia'])
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

}
