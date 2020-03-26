import { PortariaService } from './../../portaria/portaria.service';
import { OcorrenciaService } from './../../ocorrencia/ocorrencia.service';
import { MessageFirebase } from './../../../shared/firebase/message.model';
import { Ocorrencia } from './../../ocorrencia/ocorrencia.model';
import { AlertModalService } from './../../../shared-module/alert-modal.service';
import { Component, OnInit } from '@angular/core';
import { EstudanteService } from '../../estudante/estudante.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Utils } from '../../../shared/utils.shared';
import { Router, ActivatedRoute } from '@angular/router';
import { AcessoComumService } from '../../../shared/acesso-comum/acesso-comum.service';
import { HintService } from 'angular-custom-tour';
import * as moment from 'moment';

@Component({
  selector: 'ngx-gerenciar-aplicativo',
  templateUrl: './gerenciar-aplicativo.component.html',
  styleUrls: ['./gerenciar-aplicativo.component.scss'],
  providers: [EstudanteService, FirebaseService, HintService, OcorrenciaService, PortariaService],
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
export class GerenciarAplicativoComponent implements OnInit {

  public feedbackUsuario: string;
  public estado: string = 'visivel';
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public arrayOfEstudantesAplicativo = new Array<Object>();
  public esc_id: number;
  public inep: string;
  public dados_escola: Object;
  public arrayDeOcorrenciasDoAplicativo = new Array<Object>();
  public arrayDeEntradasPeloAplicativo = new Array<Object>();
  public arrayDeMensagensSimples = new Array<MessageFirebase>();
  public arrayDeMensagensEntradaManual = new Array<MessageFirebase>();

  public documentosParaAtualizar: firebase.firestore.QuerySnapshot;

  constructor(
    private router: Router,
    private hintService: HintService,
    private acessoComumService: AcessoComumService,
    private firebaseService: FirebaseService,
    private alertModalService: AlertModalService,
    private ocorrenciaService: OcorrenciaService,
    private portariaService: PortariaService,
  ) { }

  ngOnInit() {
    this.dados_escola = JSON.parse(
      Utils.decriptAtoB(
        localStorage.getItem('dados_escola'),
        CONSTANTES.PASSO_CRIPT,
      ),
    )[0];
    this.esc_id = parseInt(this.dados_escola['id'], 10);
    this.inep = Utils.pegarDadosEscolaDetalhado().inep;
    this.subscribeTour();
  }

  public subscribeTour(): void {
    this.acessoComumService.emitirAlertaInicioTour.subscribe(() => {
      this.hintService.initialize({ elementsDisabled: false });
    });
  }

  public sincronizarAplicativo(): void {
    this.router.navigate([`${this.router.url}/sincronizar-estudante-aplicativo`]);
  }

  public gerarQrcodeAplicativoEstudante(): void {
    this.router.navigate([`${this.router.url}/gerar-qrcode-aplicativo-estudante`]);
  }

  public gerarQrcodeAplicativoAdministrativo(): void {
    this.router.navigate([`${this.router.url}/gerar-qrcode-aplicativo-administrativo`]);
  }

  public baixarFotosEstudanteAplicativo(): void {
    this.router.navigate([`${this.router.url}/baixar-foto-estudante-aplicativo`]);
  }

  public gravarTipoOcorrenciaAplicativoAdministrativo(): void {
    this.router.navigate([`${this.router.url}/gravar-tipo-ocorrencia-aplicativo-administrativo`]);
  }

  public navegarListarEstudantesSemFoto(): void {
    this.router.navigate([`${this.router.url}/listar-estudante-sem-foto`]);
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

  public limparArrays(): void {
    this.arrayDeOcorrenciasDoAplicativo = [];
    this.arrayDeMensagensSimples = [];
    this.arrayOfEstudantesAplicativo = [];
    this.arrayDeEntradasPeloAplicativo = [];
  }

  public baixarOcorrenciasAplicativoAdministrativo(): void {
    this.limparArrays();
    this.feedbackUsuario = 'Verificando ocorrências registradas no aplicativo, aguarde...';
    this.firebaseService.listarOcorrenciasDisciplinaresAplicativoAdministravivo(this.inep)
      .then((retorno: firebase.firestore.QuerySnapshot) => {
        if (retorno.docs.length > 0) {
          this.documentosParaAtualizar = retorno;
          const documentos = retorno.docs;
          documentos.forEach((documento: firebase.firestore.QueryDocumentSnapshot) => {
            const firebase_dbkey_admin = documento.id;
            const dados = documento.data();
            const registrarEntradaManual = dados['registrarEntradaManual'];
            /* Ocorrência disciplinar */
            if (registrarEntradaManual == false) {
              const data = moment(new Date(dados['dataOcorrencia']['seconds'] * 1000)).format('YYYY-MM-DD');
              const hora = moment(new Date(dados['dataOcorrencia']['seconds'] * 1000)).format('HH:mm');
              const est_id = dados['est_id'];
              const ocorrenciasRegistradas = dados['ocorrenciasRegistradas'];
              const usr_id = parseInt(dados['userId'], 10);
              const nome = dados['estudanteNome'];
              Array.from(ocorrenciasRegistradas).forEach((ocorrencias) => {
                const tod_id = ocorrencias['categoriaId'];
                const tipoOcorrencia = ocorrencias['categoria'];
                const ocorrencia = dados['descricao'] == '' ? 'Não especificado' : dados['descricao'];
                this.arrayDeOcorrenciasDoAplicativo.push({
                  est_id: est_id, data: data, hora: hora,
                  tod_id: tod_id, usr_id: usr_id, firebase_dbkey_admin: firebase_dbkey_admin,
                  firebase_dbkey: '', nome: nome, tipoOcorrencia: tipoOcorrencia,
                  ocorrencia: ocorrencia,
                });
              });
            }
          });
          this.montarMensagensNovasOcorrencias();
        } else {
          this.alertModalService.showAlertWarning('Não há dados a serem sincronizadas');
          this.feedbackUsuario = undefined;
        }
      }).catch((erro: Response) => {
        this.tratarErro(erro);
      });
  }

  public montarMensagensNovasOcorrencias(): void {
    this.feedbackUsuario = 'Preparando notificações de ocorrências disciplinares...';
    const inep = Utils.pegarDadosEscolaDetalhado().inep;
    for (let i = 0; i < this.arrayDeOcorrenciasDoAplicativo.length; i++) {
      const ocorrenciaAtual = this.arrayDeOcorrenciasDoAplicativo[i];
      const nome = ocorrenciaAtual['nome'];
      const message = ocorrenciaAtual['tipoOcorrencia'];
      const messageFirebase = new MessageFirebase();
      messageFirebase.cod_inep = this.inep;
      messageFirebase.data = ocorrenciaAtual['data'];
      messageFirebase.data_versao = Utils.now();
      messageFirebase.firebase_dbkey = '';
      messageFirebase.hora = ocorrenciaAtual['hora'];
      messageFirebase.est_id = ocorrenciaAtual['est_id'];
      messageFirebase.msg = `Assunto: Ocorrência disciplinar Ocorrência: ${message}`;
      messageFirebase.msg_tag = '0';
      messageFirebase.nome_estudante = nome;
      messageFirebase.tipo_msg = message;
      messageFirebase.titulo = 'Ocorrência disciplinar';
      messageFirebase.to = `${inep}_${messageFirebase.est_id}`;
      this.arrayDeMensagensSimples.push(messageFirebase);
    }
    this.gravarOcorrenciaDisciplinarSimples(this.arrayDeMensagensSimples);
  }

  public gravarOcorrenciaDisciplinarSimples(messagesFirebase: Array<MessageFirebase>): void {
    this.feedbackUsuario = 'Gravando ocorrências, aguarde...';
    for (let i = 0; i < messagesFirebase.length; i++) {
      const messageFirebase = messagesFirebase[i];
      this.firebaseService.gravarOcorrenciaDisciplinarFirebaseFirestore(messageFirebase).then((response: Response) => {
        messageFirebase.firebase_dbkey = response['id'];
        this.arrayDeOcorrenciasDoAplicativo[i]['firebase_dbkey'] = messageFirebase.firebase_dbkey;
      }).then(() => {
        const topicoPush = `${messageFirebase.cod_inep}_${messageFirebase.est_id.toString()}`;
        const tituloPush = 'Ocorrência disciplinar';
        this.EnviarPushOcorrenciaSimples(
          topicoPush, tituloPush, messageFirebase.firebase_dbkey, messagesFirebase.length, i);
      }).catch((erro: Response) => {
        this.tratarErro(erro);
      });
    }
  }


  public EnviarPushOcorrenciaSimples(topico: string, titulo: string, firebase_dbkey: string,
    total: number, atual: number): void {
    this.feedbackUsuario = `Enviando notificação ${atual} de ${total}, aguarde...`;
    if (firebase_dbkey != '') {
      this.firebaseService
        .enviarPushFirebase(topico, titulo)
        .toPromise()
        .then((response: Response) => {
          if (total - 1 == atual) {
            this.inserirOcorrenciasDisciplinaresDoAplicativo();
          }
        }).
        catch((erro: Response) => {
          this.tratarErro(erro);
        });
    }
  }

  public inserirOcorrenciasDisciplinaresDoAplicativo(): void {
    this.feedbackUsuario = 'Finalizando, aguarde...';
    this.ocorrenciaService.inserirDoAplicativo(this.arrayDeOcorrenciasDoAplicativo)
      .toPromise().then((response: Response) => {
        this.firebaseService.atualizarStatusOcorrenciasDepoisDeSincronizar(
          this.inep, this.documentosParaAtualizar).then(() => {
            this.feedbackUsuario = undefined;
            this.alertModalService.showAlertSuccess('Operação finalizada com sucesso');
          }).catch((erro: Response) => {
            this.tratarErro(erro);
          });
      }).catch((erro: Response) => {
        this.tratarErro(erro);
      });
  }

  /* ENTRADA MANUAL */
  public baixarEntradasManuaisAplicativoAdministrativo(): void {
    this.limparArrays();
    this.feedbackUsuario = 'Verificando ocorrências registradas no aplicativo, aguarde...';
    this.firebaseService.listarEntradasManuaisAplicativoAdministravivo(this.inep)
      .then((retorno: firebase.firestore.QuerySnapshot) => {
        if (retorno.docs.length > 0) {
          this.documentosParaAtualizar = retorno;
          this.feedbackUsuario = 'Verificando entradas manuais, aguarde...';
          const documentos = this.documentosParaAtualizar;
          documentos.forEach((documento: firebase.firestore.QueryDocumentSnapshot) => {
            const firebase_dbkey_admin = documento.id;
            const dados = documento.data();
            const registrarEntradaManual = dados['registrarEntradaManual'];
            /* entrada manual */
            if (registrarEntradaManual == true) {
              const data = moment(new Date(dados['dataOcorrencia']['seconds'] * 1000)).format('YYYY-MM-DD');
              const hora = moment(new Date(dados['dataOcorrencia']['seconds'] * 1000)).format('HH:mm');
              const est_id = dados['est_id'];
              const usr_id = parseInt(dados['userId'], 10);
              const nome = dados['estudanteNome'];
              const por_id = parseInt((<String>dados['portariaId']).split('_')[1], 10);
              this.arrayDeEntradasPeloAplicativo.push({
                est_id: est_id, data: data, hora: hora,
                por_id: por_id, usr_id: usr_id, firebase_dbkey_admin: firebase_dbkey_admin,
                firebase_dbkey: '', nome: nome,
              });
            }
          });
          this.montarMensagensNovasEntradasManuais();
        } else {
          this.alertModalService.showAlertWarning('Não há dados a serem sincronizadas');
          this.feedbackUsuario = undefined;
        }
      });
  }

  public montarMensagensNovasEntradasManuais(): void {
    this.feedbackUsuario = 'Preparando notificações de entradas...';
    const inep = Utils.pegarDadosEscolaDetalhado().inep;
    for (let i = 0; i < this.arrayDeEntradasPeloAplicativo.length; i++) {
      const ocorrenciaAtual = this.arrayDeEntradasPeloAplicativo[i];
      const nome = ocorrenciaAtual['nome'];
      const messageFirebase = new MessageFirebase();
      messageFirebase.cod_inep = this.inep;
      messageFirebase.data = ocorrenciaAtual['data'];
      messageFirebase.data_versao = Utils.now();
      messageFirebase.firebase_dbkey = '';
      messageFirebase.hora = ocorrenciaAtual['hora'];
      messageFirebase.est_id = ocorrenciaAtual['est_id'];
      messageFirebase.msg = `Entrada manual: Estudante fez registro de entrada na escola manualmente:`;
      messageFirebase.msg_tag = '0';
      messageFirebase.nome_estudante = nome;
      messageFirebase.tipo_msg = 'Entrada manual';
      messageFirebase.titulo = 'Registro de entrada manual';
      messageFirebase.to = `${inep}_${messageFirebase.est_id}`;
      this.arrayDeMensagensEntradaManual.push(messageFirebase);
    }
    this.gravarEntradasManuaisDoAplicativo(this.arrayDeMensagensEntradaManual);
  }

  public gravarEntradasManuaisDoAplicativo(messagesFirebase: Array<MessageFirebase>): void {
    this.feedbackUsuario = 'Gravando entradas manuais, aguarde...';
    for (let i = 0; i < messagesFirebase.length; i++) {
      const messageFirebase = messagesFirebase[i];
      this.firebaseService.gravarEntradasManuaisFirebaseFirestore(messageFirebase).then((response: Response) => {
        messageFirebase.firebase_dbkey = response['id'];
        this.arrayDeEntradasPeloAplicativo[i]['firebase_dbkey'] = messageFirebase.firebase_dbkey;
      }).then(() => {
        const topicoPush = `${messageFirebase.cod_inep}_${messageFirebase.est_id.toString()}`;
        const tituloPush = 'Entrada registrada manualmente';
        this.EnviarPushEntradaManual(topicoPush, tituloPush, messageFirebase.firebase_dbkey,
          messagesFirebase.length, i);
      }).catch((erro: Response) => {
        this.tratarErro(erro);
      });
    }
  }

  public EnviarPushEntradaManual(topico: string, titulo: string, firebase_dbkey: string,
    total: number, atual: number): void {
    this.feedbackUsuario = `Enviando notificação ${atual} de ${total}, aguarde...`;
    if (firebase_dbkey != '') {
      this.firebaseService
        .enviarPushFirebase(topico, titulo)
        .toPromise()
        .then((response: Response) => {
          if (total - 1 == atual) {
            this.inserirEntradaManualDoAplicativo();
          }
        }).
        catch((erro: Response) => {
          this.tratarErro(erro);
        });
    }
  }


  public inserirEntradaManualDoAplicativo(): void {
    this.feedbackUsuario = 'Finalizando, aguarde...';
    const por_id = this.arrayDeEntradasPeloAplicativo[0]['por_id'];
    this.portariaService.inserirEntradasDoAplicativo(por_id, this.arrayDeEntradasPeloAplicativo)
      .toPromise().then((response: Response) => {
        this.firebaseService.atualizarStatusEntradasManuaisDepoisDeSincronizar(
          this.inep, this.documentosParaAtualizar).then(() => {
            this.feedbackUsuario = undefined;
            this.alertModalService.showAlertSuccess('Operação finalizada com sucesso');
          });
      }).catch((erro: Response) => {
        this.tratarErro(erro);
      });
  }

  public tratarErro(erro: Response): void {
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
  }
}
