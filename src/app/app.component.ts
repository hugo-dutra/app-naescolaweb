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
import { FirebaseService } from '../app/shared/firebase/firebase.service';
import * as CryptoJS from 'crypto-js';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
  providers: [AcessoComumService, AlertaService, OcorrenciaService, AlertModalService],

})
export class AppComponent implements OnInit {

  public dados_escola = new Array<Object>();
  public dados_usuario = new Array<Object>();
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
    private titleService: Title,
    private analytics: AnalyticsService,
    private router: Router,
    private acessoComumService: AcessoComumService,
    private alertaService: AlertaService,
    private ocorrenciaService: OcorrenciaService,
    private alertModalService: AlertModalService,
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        (<any>window).ga('set', 'page', event.urlAfterRedirects);
        (<any>window).ga('send', 'pageview');
      }
    });
  }

  public setTitle(): void {
    if (CONSTANTES.BUILD_DESTINO === CONSTANTES.BUILD_SEDF) {
      this.titleService.setTitle(CONSTANTES.NOME_SISTEMA_SEDF);
    }
    if (CONSTANTES.BUILD_DESTINO === CONSTANTES.BUILS_RESOLVIDOS) {
      this.titleService.setTitle(CONSTANTES.NOME_SISTEMA_RESOLVIDOS);
    }
  }



  ngOnInit(): void {
    this.analytics.trackPageViews();
    this.verificarAlertasOcorrenciasDisciplinares();
    this.setTitle();
  }

  public inicialiarFirebase(): void {

    const config = {
      apiKey: 'AIzaSyAfgiA5ogBvZXkZISWNWGOlPD8iID2KGzo',
      authDomain: 'naescolaweb-af337.firebaseapp.com',
      databaseURL: 'https://naescolaweb-af337.firebaseio.com',
      projectId: 'naescolaweb-af337',
      storageBucket: 'naescolaweb-af337.appspot.com',
      messagingSenderId: '134371598864',
    };
    firebase.initializeApp(config);
    this.logarUsuarioAnonimamenteFirebase();
  }

  public logarUsuarioAnonimamenteFirebase(): void {
    const auth = firebase.auth();
    auth.signInAnonymously().then((userCredencials: firebase.auth.UserCredential) => {
      const uid = userCredencials.user.uid;
      const nome = Utils.verificarDados()[0]['nome'];
      const usr_id = Utils.verificarDados()[0]['id'];
      const escola = Utils.pegarDadosEscola()['nome'];
      const dados_escola = JSON.parse(
        Utils.decriptAtoB(localStorage.getItem('dados_escola'), CONSTANTES.PASSO_CRIPT))[0];
      const inep = dados_escola['inep'];
      const user = { nome: nome, colegio: escola, inep: inep, codigo: usr_id };
      const criarUsuarioAnonimo = firebase.functions().httpsCallable('supervisorEscolar_GravarUsuarioAdmin');
      criarUsuarioAnonimo({ user: user, uid: uid }).then(() => { });
    });
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
    const tempDadosEscola = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados_escola'), CONSTANTES.PASSO_CRIPT));
    const tempDadosUsuario = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados'), CONSTANTES.PASSO_CRIPT));

    if (tempDadosEscola != null && tempDadosEscola !== undefined &&
      tempDadosUsuario != null && tempDadosUsuario !== undefined) {
      this.dados_escola = tempDadosEscola[0];
      this.dados_usuario = tempDadosUsuario[0];
      this.esc_id = parseInt(this.dados_escola['id'], 10);
      this.usr_id = parseInt(this.dados_usuario['id'], 10);
    }

    this.inicialiarFirebase();
  }

  public listarRegrasAlertasUsuario(): void {
    if (this.usr_id != null && this.usr_id !== undefined && this.esc_id != null && this.esc_id !== undefined) {
      this.alertaService.listarRegraAlertaUsuario(this.usr_id, this.esc_id).toPromise().then((response: Response) => {
        this.arrayOfRegrasAlertasUsuario = Object.values(response);
        this.listarAlertasOcorrencia();
      }).catch((erro: Response) => {
        // Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        // registra log de erro no firebase usando serviço singlenton
        // Gravar erros no analytics
        Utils.gravarErroAnalytics(JSON.stringify(erro));
        // Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
      });
    }
  }

  public listarAlertasOcorrencia(): void {
    this.arrayOfOcorrenciasPeriodoConsiderado = [];
    this.arrayOfOcorrenciasSelecionadas = [];
    let contaRequisicoes = 0;
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
          contaRequisicoes++;
          this.arrayOfOcorrenciasPeriodoConsiderado.push(...Object.values(response));
          if (contaRequisicoes === this.arrayOfRegrasAlertasUsuario.length) {
            this.avaliarOcorrenciasDentroRegrasAlertas();
          }
        }).catch((erro: Response) => {
          // Mostra modal
          this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
          // registra log de erro no firebase usando serviço singlenton
          // Gravar erros no analytics
          Utils.gravarErroAnalytics(JSON.stringify(erro));
          // Caso token seja invalido, reenvia rota para login
          Utils.tratarErro({ router: this.router, response: erro });

        });
    });
  }

  public avaliarOcorrenciasDentroRegrasAlertas(): void {
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
              this.acessoComumService.emitirAlertaOcorrenciaDisciplinar.emit(this.arrayOfOcorrenciasSelecionadas);
            }
            break;
          }
          case 'menor ou igual': {
            if (quantidadeOcorrenciasDeTipo <= valor_referencia && ocorrencia['tod_id'] === tod_id) {
              this.arrayOfOcorrenciasSelecionadas.push(ocorrencia);
              this.acessoComumService.emitirAlertaOcorrenciaDisciplinar.emit(this.arrayOfOcorrenciasSelecionadas);
            }
            break;
          }
          case 'igual': {
            if (quantidadeOcorrenciasDeTipo === valor_referencia && ocorrencia['tod_id'] === tod_id) {
              this.arrayOfOcorrenciasSelecionadas.push(ocorrencia);
              this.acessoComumService.emitirAlertaOcorrenciaDisciplinar.emit(this.arrayOfOcorrenciasSelecionadas);
            }
            break;
          }
          case 'maior ou igual': {
            if (quantidadeOcorrenciasDeTipo >= valor_referencia && ocorrencia['tod_id'] === tod_id) {
              this.arrayOfOcorrenciasSelecionadas.push(ocorrencia);
              this.acessoComumService.emitirAlertaOcorrenciaDisciplinar.emit(this.arrayOfOcorrenciasSelecionadas);
            }
            break;
          }
          case 'maior': {
            if (quantidadeOcorrenciasDeTipo > valor_referencia && ocorrencia['tod_id'] === tod_id) {
              this.arrayOfOcorrenciasSelecionadas.push(ocorrencia);
              this.acessoComumService.emitirAlertaOcorrenciaDisciplinar.emit(this.arrayOfOcorrenciasSelecionadas);
            }
            break;
          }
          case 'diferente': {
            if (quantidadeOcorrenciasDeTipo !== valor_referencia && ocorrencia['tod_id'] === tod_id) {
              this.arrayOfOcorrenciasSelecionadas.push(ocorrencia);
              this.acessoComumService.emitirAlertaOcorrenciaDisciplinar.emit(this.arrayOfOcorrenciasSelecionadas);
            }
            break;
          }
          default:
            break;
        }
      });
    });
  }
}
