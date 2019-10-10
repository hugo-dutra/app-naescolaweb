/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import * as firebase from 'firebase';
import { Router, NavigationEnd } from '@angular/router';
import { AcessoComumService } from './shared/acesso-comum/acesso-comum.service';
import { CONSTANTES } from './shared/constantes.shared';
import { Utils } from './shared/utils.shared';
import { AlertaService } from './crud/alerta/alerta.service';
import { OcorrenciaService } from './crud/ocorrencia/ocorrencia.service';
import { AlertModalService } from './shared-module/alert-modal.service';
import { FirebaseService } from './shared/firebase/firebase.service';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
  providers: [AcessoComumService, AlertaService, OcorrenciaService, AlertModalService],

})
export class AppComponent implements OnInit {

  public dados_escola = new Array<Object>();
  public dados_usuario = new Array<Object>();
  public estado: string = "visivel";
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
    private analytics: AnalyticsService,
    private router: Router,
    private acessoComumService: AcessoComumService,
    private alertaService: AlertaService,
    private ocorrenciaService: OcorrenciaService,
    private alertModalService: AlertModalService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        (<any>window).ga('set', 'page', event.urlAfterRedirects);
        (<any>window).ga('send', 'pageview');
      }
    });
  }

  ngOnInit(): void {
    this.analytics.trackPageViews();
    this.acessoComumService.pegarConfiguracaoFirebase().toPromise().then((response: Response) => {
      const config = JSON.parse(JSON.stringify(response));
      firebase.initializeApp(config);
    })
    this.verificarAlertasOcorrenciasDisciplinares();
  }

  public verificarAlertasOcorrenciasDisciplinares(): void {
    this.carregarDados();
    this.listarRegrasAlertasUsuario();
    setInterval(() => {
      this.carregarDados();
      this.listarRegrasAlertasUsuario();
    }, CONSTANTES.TEMPO_CONSULTA_ALERTAS);
  }

  public carregarDados(): void {
    this.anoAtual = (new Date()).getFullYear();
    this.dados_escola = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados_escola'), CONSTANTES.PASSO_CRIPT))[0];
    this.dados_usuario = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados'), CONSTANTES.PASSO_CRIPT))[0];
    this.esc_id = parseInt(this.dados_escola['id'], 10);
    this.usr_id = parseInt(this.dados_usuario['id'], 10);
  }

  public listarRegrasAlertasUsuario(): void {
    this.alertaService.listarRegraAlertaUsuario(this.usr_id, this.esc_id).toPromise().then((response: Response) => {
      this.arrayOfRegrasAlertasUsuario = Object.values(response)
      this.listarAlertasOcorrencia();
    }).catch((erro: Response) => {
      //Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      //registra log de erro no firebase usando serviço singlenton

      //Gravar erros no analytics
      Utils.gravarErroAnalytics(JSON.stringify(erro));
      //Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
    })
  }

  public listarAlertasOcorrencia(): void {
    this.arrayOfOcorrenciasPeriodoConsiderado = [];
    this.arrayOfOcorrenciasSelecionadas = [];
    let contaRequisicoes = 0;
    this.arrayOfRegrasAlertasUsuario.forEach(regraAlerta => {
      const esc_id = parseInt(regraAlerta["esc_id"]);
      const usr_id = this.usr_id;
      const tod_id = parseInt(regraAlerta["tod_id"]);
      const data_inicio = regraAlerta["data_inicio"];
      const data_fim = regraAlerta["data_fim"];
      this.ocorrenciaService.listarQuantidadeAlertaNaoVerificado(
        esc_id,
        usr_id,
        tod_id,
        data_inicio,
        data_fim)
        .toPromise()
        .then((response: Response) => {
          const alertas = Object.values(response);
          this.acessoComumService.emitirAlertaOcorrenciaDisciplinar.emit(alertas);
          contaRequisicoes++;
          this.arrayOfOcorrenciasPeriodoConsiderado.push(...Object.values(response));
          if (contaRequisicoes == this.arrayOfRegrasAlertasUsuario.length) {
            this.avaliarOcorrenciasDentroRegrasAlertas();
          }
        }).catch((erro: Response) => {
          //Mostra modal
          this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
          //registra log de erro no firebase usando serviço singlenton
          //Gravar erros no analytics
          Utils.gravarErroAnalytics(JSON.stringify(erro));
          //Caso token seja invalido, reenvia rota para login
          Utils.tratarErro({ router: this.router, response: erro });

        })
    })
  }

  public avaliarOcorrenciasDentroRegrasAlertas(): void {
    this.arrayOfRegrasAlertasUsuario.forEach(regraAlerta => {
      const valor_referencia = parseInt(regraAlerta["valor_referencia"]);
      const operador = regraAlerta["operador"];
      const tod_id = regraAlerta["tod_id"];
      this.arrayOfOcorrenciasPeriodoConsiderado.forEach(ocorrencia => {
        const quantidadeOcorrenciasDeTipo = parseInt(ocorrencia["quantidade"]);
        switch (operador) {
          case "menor": {
            if (quantidadeOcorrenciasDeTipo < valor_referencia && ocorrencia["tod_id"] == tod_id) {
              this.arrayOfOcorrenciasSelecionadas.push(ocorrencia);
            }
            break;
          }
          case "menor ou igual": {
            if (quantidadeOcorrenciasDeTipo <= valor_referencia && ocorrencia["tod_id"] == tod_id) {
              this.arrayOfOcorrenciasSelecionadas.push(ocorrencia);
            }
            break;
          }
          case "igual": {
            if (quantidadeOcorrenciasDeTipo == valor_referencia && ocorrencia["tod_id"] == tod_id) {
              this.arrayOfOcorrenciasSelecionadas.push(ocorrencia);
            }
            break;
          }
          case "maior ou igual": {
            if (quantidadeOcorrenciasDeTipo >= valor_referencia && ocorrencia["tod_id"] == tod_id) {
              this.arrayOfOcorrenciasSelecionadas.push(ocorrencia);
            }
            break;
          }
          case "maior": {
            if (quantidadeOcorrenciasDeTipo > valor_referencia && ocorrencia["tod_id"] == tod_id) {
              this.arrayOfOcorrenciasSelecionadas.push(ocorrencia);
            }
            break;
          }
          case "diferente": {
            if (quantidadeOcorrenciasDeTipo != valor_referencia && ocorrencia["tod_id"] == tod_id) {
              this.arrayOfOcorrenciasSelecionadas.push(ocorrencia);
            }
            break;
          }
          default:
            break;
        }
      })
    })
  }
}
