import { Component, OnInit } from '@angular/core';
import { OcorrenciaService } from '../ocorrencia.service';
import { EstudanteService } from '../../estudante/estudante.service';
import { TipoOcorrenciaDisciplinarService } from '../../tipo-ocorrencia-disciplinar/tipo-ocorrencia-disciplinar.service';
import { TurmaService } from '../../turma/turma.service';
import { ComunicadoDiversoService } from '../../comunicado-diverso/comunicado-diverso.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { MessageFirebase } from '../../../shared/firebase/message.model';
import { Ocorrencia } from '../ocorrencia.model';
import { ComunicadoDiverso } from '../../comunicado-diverso/comunicado-diverso.model';
import { Router } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-inserir-ocorrencia',
  templateUrl: './inserir-ocorrencia.component.html',
  styleUrls: ['./inserir-ocorrencia.component.scss'],
  providers: [
    OcorrenciaService,
    EstudanteService,
    TipoOcorrenciaDisciplinarService,
    TurmaService,
    ComunicadoDiversoService
  ],
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
export class InserirOcorrenciaComponent implements OnInit {

  public arrayOfEstudantes = new Array<number>();
  public arrayOfMatriculasEstudantes = new Array<string>();
  public arrayOfNomesEstudantes = new Array<string>();
  public arrayOfEstudantesMultiplo = new Array<MessageFirebase>();
  public arrayOfResumoOcorrencias = new Array<Object>();
  public arrayOfMensagens = new Array<MessageFirebase>();
  public arrayDeMensagensSimples = new Array<MessageFirebase>()

  public estudantes: Array<Object>;
  public resumoOcorrencias: Object;
  public ocorrencias: Array<Object>;
  public estudantesTurma: Object;
  public turmas: Object;

  public nomeEstudanteProcurado: string;
  public nomeEstudanteOcorrenciaProcurado: string;

  public tiposOcorrenciasDisciplinares: Object;
  public tipoOcorrenciaSimples: string;
  public tipoOcorrenciaMultiplo: string;
  public trm_id: number;
  public esc_id: number;
  public tod_id: number;
  public ocorrencia = new Ocorrencia();
  public comunicadoDiverso = new ComunicadoDiverso();
  public caracteresDisponiveis: string;
  public statusBotaoSalvarOcorrenciaSimples: boolean = true;
  public statusBotaoSalvarOcorrenciaMultipla: boolean = true;

  public feedbackUsuario: string;
  public estado: string = "visivel";
  public tableLimit: number = 10;
  public totalRegistros: number;
  public offsetRegistros: number = 0;
  public saltarQuantidade: number = 5;
  public navegacaoInicio: boolean = undefined;
  public navegacaoFim: boolean = undefined;
  public valorFiltro: string = "";
  public statusFiltro: boolean = false;
  public exibeBotaoImprimirOcorrenciasEstudante: boolean = false;

  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;

  public decrescente: boolean = true;

  /* private relatorioPDFOcorrenciasEstudante = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compressPdf: true,
  }); */

  private relatorioPDFOcorrenciasEstudante: jsPDF;

  constructor(
    private ocorrenciaService: OcorrenciaService,
    private estudanteService: EstudanteService,
    private turmaService: TurmaService,
    private router: Router,
    private tipoOcorrenciaDisciplinarService: TipoOcorrenciaDisciplinarService,
    private comunicadoDiversoService: ComunicadoDiversoService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService
  ) { }

  ngOnInit() {
    this.esc_id = parseInt(Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT));
    this.listarTipoOcorrenciaDisciplinar();
    this.listarTurmas();
  }

  //#region ######################################### OCORRENCIA SIMPLES #################################################

  public ordenarColunaSimples(campo: string): void {
    if (!this.decrescente) {
      let retorno = this.estudantes.sort(function (a, b) {
        if (a[campo] < b[campo]) {
          return 1;
        }
        if (a[campo] > b[campo]) {
          return -1;
        }
        return 0;
      })
      this.estudantes = retorno;

    } else {
      let retorno = this.estudantes.sort(function (a, b) {
        if (a[campo] > b[campo]) {
          return 1;
        }
        if (a[campo] < b[campo]) {
          return -1;
        }
        return 0;
      })
      this.estudantes = retorno;
    }
    this.decrescente = !this.decrescente;
  }

  public montarMensagemComunicado(event: Event): void {
    let dados_escola = JSON.parse(Utils.decriptAtoB(localStorage.getItem("dados_escola"), CONSTANTES.PASSO_CRIPT));
    let inep = dados_escola[0]["inep"];
    let telefone = dados_escola[0]["telefone"];
    let est_id: number = parseInt((<HTMLInputElement>event.target).value);
    this.comunicadoDiverso.est_id = est_id;

    this.feedbackUsuario = "Gravando comunicado, aguarde...";
    this.tipoOcorrenciaDisciplinarService
      .listarEstId(est_id)
      .toPromise()
      .then((response: Response) => {
        let resumo_ocorrencias: Object = response;
        let quantidade_resumo_ocorrencias = Object.keys(resumo_ocorrencias).map(
          i => resumo_ocorrencias
        ).length;
        let nome: string = resumo_ocorrencias[0]["nome"];
        let matricula = resumo_ocorrencias[0]["matricula"];
        let message = `O(a) Estudante ${nome.toUpperCase()} já possui ${quantidade_resumo_ocorrencias} ocorrências disciplinares. Solicitamos que o(a) Sr.(a) responsável entre em contato com a escola para tratarmos desse assunto.`;
        this.arrayDeMensagensSimples = [];
        let messageFirebase = new MessageFirebase();
        messageFirebase.cod_inep = inep;
        messageFirebase.data = new Date().getFullYear().toString() + "-" + ("0" + (new Date().getMonth() + 1)).slice(-2).toString() + "-" + ("0" + new Date().getDate()).slice(-2).toString();
        messageFirebase.data_versao = Utils.now();
        messageFirebase.firebase_dbkey = "";
        messageFirebase.hora = ("0" + new Date().getHours()).slice(-2).toString() + ":" + ("0" + new Date().getMinutes()).slice(-2).toString() + ":00";
        messageFirebase.id = "";
        messageFirebase.matricula = matricula;
        messageFirebase.msg = `${message} Para detalhes, procure a direção ou assistência na unidade escolar Telefone: ${telefone}`;
        messageFirebase.msg_tag = "0";
        messageFirebase.nome_estudante = nome;
        messageFirebase.tipo_msg = "Comunicado"//CONSTANTES.FIREBASE_MSG_COMUNICADO;
        messageFirebase.titulo = "Comunicado";
        messageFirebase.to = `${inep}_${matricula}`;
        this.arrayDeMensagensSimples.push(messageFirebase)
        this.gravarComunicadoDirecao(this.arrayDeMensagensSimples);
      })
      .catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      });
  }

  public gravarComunicadoDirecao(messagesFirebase: Array<MessageFirebase>): void {
    this.feedbackUsuario = "Gravando comunicado, aguarde...";
    for (let i = 0; i < messagesFirebase.length; i++) {
      let messageFirebase = messagesFirebase[i];
      this.firebaseService.gravarComunicadoDirecaoFirebaseFirestore(messageFirebase).then((response: Response) => {
        messageFirebase.firebase_dbkey = response["id"];
      }).then(() => {
        this.feedbackUsuario = undefined;
        const topicoPush = `${messageFirebase.cod_inep}_${messageFirebase.matricula}`;
        const tituloPush = "Comunicado";
        this.EnviarPushComunicadoSimples(topicoPush, tituloPush, messageFirebase.firebase_dbkey, messagesFirebase.length, i, messageFirebase);
      }).catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      })
    }
  }

  public montarMensagensNovasOcorrencias(): void {
    let dados_escola = JSON.parse(Utils.decriptAtoB(localStorage.getItem("dados_escola"), CONSTANTES.PASSO_CRIPT));
    let inep = dados_escola[0]["inep"];
    let telefone = dados_escola[0]["telefone"];
    this.arrayDeMensagensSimples = [];
    for (let i = 0; i < this.arrayOfEstudantes.length; i++) {
      let matricula = this.arrayOfMatriculasEstudantes[i];
      let nome = this.arrayOfNomesEstudantes[i];
      let message = `${this.tipoOcorrenciaSimples}.`;
      let messageFirebase = new MessageFirebase();
      messageFirebase.cod_inep = inep;
      messageFirebase.data = new Date().getFullYear().toString() + "-" + ("0" + (new Date().getMonth() + 1)).slice(-2).toString() + "-" + ("0" + new Date().getDate()).slice(-2).toString();
      messageFirebase.data_versao = Utils.now();
      messageFirebase.firebase_dbkey = "";
      messageFirebase.hora = ("0" + new Date().getHours()).slice(-2).toString() + ":" + ("0" + new Date().getMinutes()).slice(-2).toString() + ":00";
      messageFirebase.id = this.arrayOfEstudantes[i].toString();
      messageFirebase.matricula = matricula;
      messageFirebase.msg = `Assunto: Ocorrência disciplinar Ocorrência: ${message} Para detalhes, procure a direção ou assistência na unidade escolar Telefone: ${telefone}`;
      messageFirebase.msg_tag = "0";
      messageFirebase.nome_estudante = nome;
      messageFirebase.tipo_msg = message;
      messageFirebase.titulo = "Ocorrência disciplinar";
      messageFirebase.to = `${inep}_${matricula}`;
      this.arrayDeMensagensSimples.push(messageFirebase);
    }
    this.gravarOcorrenciaDisciplinarSimples(this.arrayDeMensagensSimples);
  }

  public gravarOcorrenciaDisciplinarSimples(messagesFirebase: Array<MessageFirebase>): void {
    this.feedbackUsuario = "Gravando ocorrências, aguarde...";
    for (let i = 0; i < messagesFirebase.length; i++) {
      let messageFirebase = messagesFirebase[i];
      this.firebaseService.gravarOcorrenciaDisciplinarFirebaseFirestore(messageFirebase).then((response: Response) => {
        messageFirebase.firebase_dbkey = response["id"];
      }).then(() => {
        this.feedbackUsuario = undefined;
        const topicoPush = `${messageFirebase.cod_inep}_${messageFirebase.matricula}`;
        const tituloPush = "Ocorrência disciplinar";
        this.EnviarPushOcorrenciaSimples(topicoPush, tituloPush, messageFirebase.firebase_dbkey, messagesFirebase.length, i);
      }).catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      })
    }
  }

  public montarMensagemSuspender(event: Event): void {
    let dados_escola = JSON.parse(Utils.decriptAtoB(localStorage.getItem("dados_escola"), CONSTANTES.PASSO_CRIPT));
    let inep = dados_escola[0]["inep"];
    let telefone = dados_escola[0]["telefone"];
    let est_id: number = parseInt((<HTMLInputElement>event.target).value);
    this.comunicadoDiverso.est_id = est_id;
    this.feedbackUsuario = "Gravando comunicado, aguarde...";
    this.tipoOcorrenciaDisciplinarService
      .listarEstId(est_id)
      .toPromise()
      .then((response: Response) => {
        let resumo_ocorrencias: Object = response;
        let quantidade_resumo_ocorrencias = Object.keys(resumo_ocorrencias).map(
          i => resumo_ocorrencias
        ).length;
        let nome: string = resumo_ocorrencias[0]["nome"];
        let matricula = resumo_ocorrencias[0]["matricula"];
        let message = `O(a) Estudante ${nome.toUpperCase()} já possui ${quantidade_resumo_ocorrencias} ocorrências disciplinares e está sendo SUSPENSO(a). Solicitamos que o(a) Sr.(a) responsável entre em contato com a escola para tratarmos desse assunto.`;
        this.arrayDeMensagensSimples = [];
        let messageFirebase = new MessageFirebase();
        messageFirebase.cod_inep = inep;
        messageFirebase.data = new Date().getFullYear().toString() + "-" + ("0" + (new Date().getMonth() + 1)).slice(-2).toString() + "-" + ("0" + new Date().getDate()).slice(-2).toString();
        messageFirebase.data_versao = Utils.now();
        messageFirebase.firebase_dbkey = "";
        messageFirebase.hora = ("0" + new Date().getHours()).slice(-2).toString() + ":" + ("0" + new Date().getMinutes()).slice(-2).toString() + ":00";
        messageFirebase.id = est_id.toString();
        messageFirebase.matricula = matricula;
        messageFirebase.msg = `Assunto: Comunicado importante Informe: ${message} Para detalhes, procure a direção ou assistência na unidade escolar Telefone: ${telefone}`;
        messageFirebase.msg_tag = "0";
        messageFirebase.nome_estudante = nome;
        messageFirebase.tipo_msg = "Comunicado importante";
        messageFirebase.titulo = "Comunicado importante";
        messageFirebase.to = `${inep}_${matricula}`;
        this.arrayDeMensagensSimples.push(messageFirebase)
        this.gravarComunicadoSuspender(this.arrayDeMensagensSimples);
      })
      .catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;

      });
  }

  public gravarComunicadoSuspender(messagesFirebase: Array<MessageFirebase>): void {
    this.feedbackUsuario = "Gravando comunicado, aguarde...";
    for (let i = 0; i < messagesFirebase.length; i++) {
      let messageFirebase = messagesFirebase[i];
      this.firebaseService.gravarComunicadoDirecaoFirebaseFirestore(messageFirebase).then((response: Response) => {
        messageFirebase.firebase_dbkey = response["id"];
      }).then(() => {
        this.feedbackUsuario = undefined;
        const topicoPush = `${messageFirebase.cod_inep}_${messageFirebase.matricula}`;
        const tituloPush = "Comunicado importante";
        this.EnviarPushOcorrenciaSuspender(topicoPush, tituloPush, messageFirebase.firebase_dbkey, messagesFirebase.length, i, messagesFirebase);

      }).catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      })
    }
  }

  public EnviarPushOcorrenciaSuspender(topico: string, titulo: string, firebase_dbkey: string, total: number, atual: number, messagesFirebase: MessageFirebase[]): void {
    this.feedbackUsuario = "Enviando notificação, aguarde...";
    if (firebase_dbkey != "") {
      this.firebaseService
        .enviarPushFirebase(topico, titulo)
        .toPromise()
        .then((response: Response) => {
          if (total - 1 == atual) {
            this.gravarComunicadoDiverso(messagesFirebase[0]);
          }
        }).
        catch((erro: Response) => {
          //Mostra modal
          this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
          //registra log de erro no firebase usando serviço singlenton
          this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
          //Caso token seja invalido, reenvia rota para login
          Utils.tratarErro({ router: this.router, response: erro });
          this.feedbackUsuario = undefined;
        });
    }
  }

  public EnviarPushOcorrenciaSimples(topico: string, titulo: string, firebase_dbkey: string, total: number, atual: number): void {
    this.feedbackUsuario = "Enviando notificação, aguarde...";
    if (firebase_dbkey != "") {
      this.firebaseService
        .enviarPushFirebase(topico, titulo)
        .toPromise()
        .then((response: Response) => {
          if (total - 1 == atual) {
            this.inserir();
          }
        }).
        catch((erro: Response) => {
          //Mostra modal
          this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
          //registra log de erro no firebase usando serviço singlenton
          this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
          //Caso token seja invalido, reenvia rota para login
          Utils.tratarErro({ router: this.router, response: erro });
          this.feedbackUsuario = undefined;
        });
    }
  }

  public EnviarPushComunicadoSimples(topico: string, titulo: string, firebase_dbkey: string, total: number, atual: number, messageFirebase: MessageFirebase): void {
    this.feedbackUsuario = "Enviando notificação, aguarde...";
    if (firebase_dbkey != "") {
      this.firebaseService
        .enviarPushFirebase(topico, titulo)
        .toPromise()
        .then((response: Response) => {
          if (total - 1 == atual) {
            this.gravarComunicadoDiverso(messageFirebase);
          }
        }).
        catch((erro: Response) => {
          //Mostra modal
          this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
          //registra log de erro no firebase usando serviço singlenton
          this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
          //Caso token seja invalido, reenvia rota para login
          Utils.tratarErro({ router: this.router, response: erro });
          this.feedbackUsuario = undefined;
        });
    }
  }

  public gravarComunicadoDiverso(messageFirebase: MessageFirebase): void {
    this.feedbackUsuario = "Finalizando comunicado, aguarde...";
    this.comunicadoDiverso.assunto = messageFirebase.titulo;
    this.comunicadoDiverso.data_comunicado = new Date().getFullYear().toString() + "-" + ("0" + (new Date().getMonth() + 1)).slice(-2).toString() + "-" + ("0" + new Date().getDate()).slice(-2).toString();//Ajuste no formato da data.
    this.comunicadoDiverso.fbdbkey = messageFirebase.firebase_dbkey;
    this.comunicadoDiverso.hora = messageFirebase.hora;
    this.comunicadoDiverso.mensagem = messageFirebase.msg;
    this.comunicadoDiverso.status_comunicado = 0;
    this.comunicadoDiverso.usr_id = JSON.parse(Utils.decriptAtoB(localStorage.getItem("dados"), CONSTANTES.PASSO_CRIPT))[0].id;
    this.comunicadoDiversoService.inserir(this.comunicadoDiverso).toPromise().then((response: Response) => {
      this.feedbackUsuario = undefined;
    }).catch((erro: Response) => {
      //Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      //registra log de erro no firebase usando serviço singlenton
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
      //Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
      this.feedbackUsuario = undefined;
    })
  }

  public limparDadosOcorrencia(): void {
    this.ocorrencia.id = -1;
    this.ocorrencia.array_msg = [];
    this.ocorrencia.data_hora = "";
    this.ocorrencia.est_id = -1;
    this.ocorrencia.ocorrencia = "";
    this.ocorrencia.tod_id = -1;
    this.ocorrencia.usr_id = -1;

    this.estudantes = [];
    this.arrayDeMensagensSimples = [];
    this.arrayOfEstudantes = [];
    this.arrayOfEstudantesMultiplo = [];
    this.arrayOfMatriculasEstudantes = [];
    this.arrayOfMensagens = [];
    this.arrayOfNomesEstudantes = [];
    this.arrayOfResumoOcorrencias = [];

    this.filtrar();
    (<HTMLInputElement>document.getElementById("input_descricao")).value = "";
    (<HTMLInputElement>document.getElementById("input_tipo_ocorrencia")).value = "";
    (<HTMLInputElement>document.getElementById("input_consulta")).value = "";
  }

  public listarTipoOcorrenciaDisciplinar(): void {
    this.feedbackUsuario = "Carregando dados, aguarde...";
    this.tipoOcorrenciaDisciplinarService
      .listar(1000, 0, true, this.esc_id)
      .toPromise()
      .then((response: Response) => {
        this.tiposOcorrenciasDisciplinares = response;
        this.feedbackUsuario = undefined;
      })
      .catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      });
  }

  public gravarNome(event: Event): void {
    this.nomeEstudanteProcurado = (<HTMLInputElement>event.target).value;
  }

  public listarQuantidade(limit: number = 5) {
    this.navegacaoInicio = undefined;
    this.navegacaoFim = undefined;

    this.offsetRegistros = 0;
    this.saltarQuantidade = limit;

    this.filtrar(this.saltarQuantidade);
  }

  public gravarTipoOcorrencia(event: Event): void {
    let dados_escola = JSON.parse(Utils.decriptAtoB(localStorage.getItem("dados_escola"), CONSTANTES.PASSO_CRIPT));
    let telefone = dados_escola[0]["telefone"];
    this.ocorrencia.tod_id = parseInt((<HTMLInputElement>event.target).value.toString().split('|')[0]);
    this.tipoOcorrenciaSimples = (<HTMLInputElement>event.target).value.toString().split('|')[1]
    for (let i = 0; i < this.arrayDeMensagensSimples.length; i++) {
      this.arrayDeMensagensSimples[i].msg = `Assunto: Ocorrência disciplinar Ocorrência: ${this.tipoOcorrenciaSimples} Para detalhes, procure a direção ou assistência na unidade escolar Telefone: ${telefone}`;
    }
    this.validarSalvarOcorrenciaSimples();
  }

  public validarSalvarOcorrenciaSimples(): void {
    if (this.arrayOfEstudantes.length > 0 &&
      this.arrayOfMatriculasEstudantes.length > 0 &&
      this.arrayOfNomesEstudantes.length > 0 &&
      this.ocorrencia.tod_id != undefined) {
      this.statusBotaoSalvarOcorrenciaSimples = false;
    } else {
      this.statusBotaoSalvarOcorrenciaSimples = true;
    }
  }

  public inserir(): void {
    this.feedbackUsuario = "Salvando dados, aguarde...";
    this.ocorrencia.data_hora = Utils.now();
    this.ocorrencia.usr_id = JSON.parse(
      Utils.decriptAtoB(localStorage.getItem("dados"), CONSTANTES.PASSO_CRIPT)
    )[0].id;
    this.ocorrencia.array_msg = this.arrayDeMensagensSimples;
    this.ocorrenciaService
      .inserir(this.ocorrencia)
      .toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = undefined;
        this.limparDadosOcorrencia();
      })
      .catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
        this.limparDadosOcorrencia();
      });
  }

  public gravaDescricao(event: Event): void {
    this.ocorrencia.ocorrencia = (<HTMLInputElement>event.target).value;
    this.caracteresDisponiveis =
      "Restando " + (300 - this.ocorrencia.ocorrencia.length).toString();

    if (this.ocorrencia.ocorrencia.length == 0) {
      this.caracteresDisponiveis = "";
    }
  }

  public gravaStatusEstudantes(event: Event): void {
    let est_id_matricula_nome: string = (<HTMLInputElement>event.target).value;
    let status: boolean = (<HTMLInputElement>event.target).checked;

    if (status) {
      this.arrayOfEstudantes.push(parseInt(est_id_matricula_nome.split('|')[0]));
      this.arrayOfMatriculasEstudantes.push(est_id_matricula_nome.split('|')[1])
      this.arrayOfNomesEstudantes.push(est_id_matricula_nome.split('|')[2])
    } else {
      this.arrayOfEstudantes.splice(
        this.arrayOfEstudantes.indexOf(parseInt(est_id_matricula_nome.split('|')[0]), 0),
        1
      );
      this.arrayOfMatriculasEstudantes.splice(
        this.arrayOfMatriculasEstudantes.indexOf((est_id_matricula_nome.split('|')[1]), 0),
        1
      );
      this.arrayOfNomesEstudantes.splice(
        this.arrayOfNomesEstudantes.indexOf((est_id_matricula_nome.split('|')[2]), 0),
        1
      );
    }

    this.validarSalvarOcorrenciaSimples();
  }


  public filtrarEnter(event: KeyboardEvent) {
    if (event.key == "Enter") {
      this.filtrar();
    }
  }

  public filtrar(limit: number = 10, offset: number = 0): void {
    this.statusBotaoSalvarOcorrenciaSimples = true;
    this.saltarQuantidade = limit;
    this.feedbackUsuario = undefined;
    this.feedbackUsuario = "Carregando dados, aguarde...";
    this.arrayOfResumoOcorrencias = [];
    this.estudanteService
      .filtrarContaOcorrencia(
        this.nomeEstudanteProcurado,
        limit,
        offset,
        this.esc_id
      )
      .toPromise()
      .then((response: Response) => {
        this.estudantes = Object.values(response);
        if (this.estudantes != undefined) {
          if (this.estudantes.length > 0) {
            this.totalRegistros = parseInt(this.estudantes[0]["total"]);
          }
        }
        this.feedbackUsuario = undefined;
      })
      .then(() => {
        this.feedbackUsuario = "Carregando resumos, aguarde...";
        let estudantesArray: Array<Object> = Object.keys(this.estudantes).map(
          i => this.estudantes[i]
        );
        for (let i = 0; i < estudantesArray.length; i++) {
          let est_id: number = estudantesArray[i]["id"];
          this.tipoOcorrenciaDisciplinarService
            .listarEstId(est_id)
            .toPromise()
            .then((response: Response) => {
              this.arrayOfResumoOcorrencias.push(response);
              this.feedbackUsuario = undefined;
            }).catch((erro: Response) => {
              this.feedbackUsuario = undefined;
            });
        }
        if (estudantesArray.length == 0) {
          this.feedbackUsuario = undefined;
        }
      })
      .catch((erro: Response) => {
        this.feedbackUsuario = undefined;
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
      });
  }

  public navegarProximo() {
    this.offsetRegistros = this.offsetRegistros + this.saltarQuantidade;
    this.filtrar(this.saltarQuantidade, this.offsetRegistros);
    if (this.offsetRegistros + this.saltarQuantidade > this.totalRegistros) {
      this.offsetRegistros = this.offsetRegistros - this.saltarQuantidade;
      this.navegacaoFim = true;
      this.navegacaoInicio = false;
    } else {
      this.navegacaoFim = false;
      this.navegacaoInicio = false;
    }
  }

  public navegarAnterior() {
    if (this.navegacaoInicio === false || this.navegacaoInicio === undefined) {
      this.filtrar(this.saltarQuantidade, this.offsetRegistros);
      this.offsetRegistros = this.offsetRegistros - this.saltarQuantidade;
    } else {
      this.navegacaoInicio = true;
      this.navegacaoFim = false;
    }
    if (this.offsetRegistros + this.saltarQuantidade < this.saltarQuantidade) {
      this.offsetRegistros = this.offsetRegistros + this.saltarQuantidade;
      this.navegacaoInicio = true;
      this.navegacaoFim = false;
    } else {
      this.navegacaoInicio = false;
      this.navegacaoFim = false;
    }
  }
  //#endregion

  //#region ######################################## OCORRENCIA MULTIPLA #################################################
  public limparDadosOcorrenciaMultipla(): void {
    this.ocorrencia.id = -1;
    this.ocorrencia.array_msg = [];
    this.ocorrencia.data_hora = "";
    this.ocorrencia.est_id = -1;
    this.ocorrencia.ocorrencia = "";
    this.ocorrencia.tod_id = -1;
    this.ocorrencia.usr_id = -1;
    this.estudantes = [];
    this.arrayOfEstudantes = [];
    this.arrayOfEstudantesMultiplo = [];
    this.estudantesTurma = [];

    (<HTMLInputElement>document.getElementById("input_turmas")).value = "";
    (<HTMLInputElement>(
      document.getElementById("input_descricao_multipla")
    )).value = "";
    (<HTMLInputElement>(
      document.getElementById("input_tipo_ocorrencia_multipla")
    )).value = "";
    (<HTMLInputElement>(
      document.getElementById("selecionarTodos")
    )).checked = false;
  }

  public listarTurmas(): void {
    this.feedbackUsuario = "Carregando dados, aguarde...";
    this.turmaService
      .listarTodasAno(new Date().getFullYear(), this.esc_id)
      .toPromise()
      .then((response: Response) => {
        this.turmas = response;
        this.feedbackUsuario = undefined;
      })
      .catch((erro: Response) => {
        this.feedbackUsuario = undefined;
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
      });
  }

  public gravaDescricaoMultiplo(event: Event): void {
    this.ocorrencia.ocorrencia = (<HTMLInputElement>event.target).value;
    this.caracteresDisponiveis =
      "Restando " + (300 - this.ocorrencia.ocorrencia.length).toString();

    if (this.ocorrencia.ocorrencia.length == 0) {
      this.caracteresDisponiveis = "";
    }
  }

  public gravarTipoOcorrenciaMultiplo(event: Event): void {
    this.ocorrencia.tod_id = parseInt((<HTMLInputElement>event.target).value.toString().split('|')[0]);
    this.tipoOcorrenciaMultiplo = ((<HTMLInputElement>event.target).value.toString().split('|')[1]);
    this.validarSalvarOcorrenciaMultipla();
  }

  public selecionarEstudantePorTurma(event: Event): void {
    this.feedbackUsuario = "Carregando dados, aguarde...";
    this.trm_id = parseInt((<HTMLInputElement>event.target).value);
    this.estudanteService
      .listarTurmaId(this.trm_id)
      .toPromise()
      .then((response: Response) => {
        this.estudantesTurma = response;
        this.feedbackUsuario = undefined;
      })
      .catch((erro: Response) => {
        this.feedbackUsuario = undefined;
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
      });
  }

  public gravaStatusEstudantesMultiplo(event: Event): void {

    let dados_estudante_selecionado: string = (<HTMLInputElement>event.target).value;
    let status: boolean = (<HTMLInputElement>event.target).checked;

    let firebaseMessage = new MessageFirebase();
    firebaseMessage.id = dados_estudante_selecionado.split("|")[0];
    firebaseMessage.matricula = dados_estudante_selecionado.split("|")[1];
    firebaseMessage.nome_estudante = dados_estudante_selecionado.split("|")[2];

    if (status) {
      this.arrayOfEstudantesMultiplo.push(firebaseMessage);
    } else {
      for (let i = 0; i < this.arrayOfEstudantesMultiplo.length; i++) {
        if (firebaseMessage.id == this.arrayOfEstudantesMultiplo[i].id) {
          this.arrayOfEstudantesMultiplo.splice(i, 1);
        }
      }
    }
    this.validarSalvarOcorrenciaMultipla();
  }

  public selecionarTodos(event: Event) {
    let checkBoxes = (<HTMLInputElement>event.target).form;
    for (let i = 0; i < checkBoxes.length; i++) {
      if ((<HTMLInputElement>event.target).checked) {
        if (!isNaN(parseInt((<HTMLInputElement>checkBoxes[i]).name))) {
          let dados_estudante_selecionado: string = (<HTMLInputElement>checkBoxes[i]).value;
          let firebaseMessage = new MessageFirebase();
          firebaseMessage.id = dados_estudante_selecionado.split("|")[0];
          firebaseMessage.matricula = dados_estudante_selecionado.split("|")[1];
          firebaseMessage.nome_estudante = dados_estudante_selecionado.split("|")[2];
          this.arrayOfEstudantesMultiplo.push(firebaseMessage);
          (<HTMLInputElement>checkBoxes[i]).checked = (<HTMLInputElement>(event.target)).checked;
        }
      } else {
        this.arrayOfEstudantesMultiplo = [];
        (<HTMLInputElement>checkBoxes[i]).checked = (<HTMLInputElement>(
          event.target
        )).checked;
      }
    }
  }

  public validarSalvarOcorrenciaMultipla(): void {
    if (this.arrayOfEstudantesMultiplo.length > 0 && this.tipoOcorrenciaMultiplo != undefined) {
      this.statusBotaoSalvarOcorrenciaMultipla = false;
    } else {
      this.statusBotaoSalvarOcorrenciaMultipla = true;
    }
  }

  public montarMensagensNovasOcorrenciasMultiplas(): void {
    let dados_escola = JSON.parse(Utils.decriptAtoB(localStorage.getItem("dados_escola"), CONSTANTES.PASSO_CRIPT));
    let inep = dados_escola[0]["inep"];
    let telefone = dados_escola[0]["telefone"];
    debugger;
    let message = `${this.tipoOcorrenciaMultiplo}.`;
    for (let i = 0; i < this.arrayOfEstudantesMultiplo.length; i++) {
      this.arrayOfEstudantesMultiplo[i].cod_inep = inep;
      this.arrayOfEstudantesMultiplo[i].data = new Date().getFullYear().toString() + "-" + ("0" + (new Date().getMonth() + 1)).slice(-2).toString() + "-" + ("0" + new Date().getDate()).slice(-2).toString();
      this.arrayOfEstudantesMultiplo[i].data_versao = Utils.now();
      this.arrayOfEstudantesMultiplo[i].firebase_dbkey = "";
      this.arrayOfEstudantesMultiplo[i].hora = ("0" + new Date().getHours()).slice(-2).toString() + ":" + ("0" + new Date().getMinutes()).slice(-2).toString() + ":00";
      this.arrayOfEstudantesMultiplo[i].id = this.arrayOfEstudantesMultiplo[i].id;
      this.arrayOfEstudantesMultiplo[i].matricula = this.arrayOfEstudantesMultiplo[i].matricula;
      this.arrayOfEstudantesMultiplo[i].msg = `Assunto: Ocorrência disciplinar Ocorrência: ${message} Para detalhes, procure a direção ou assistência na unidade escolar Telefone: ${telefone}`;
      this.arrayOfEstudantesMultiplo[i].msg_tag = "0";
      this.arrayOfEstudantesMultiplo[i].nome_estudante = this.arrayOfEstudantesMultiplo[i].nome_estudante;
      this.arrayOfEstudantesMultiplo[i].tipo_msg = message;//CONSTANTES.FIREBASE_MSG_OCORRENCIA;
      this.arrayOfEstudantesMultiplo[i].titulo = "Ocorrência disciplinar";
      this.arrayOfEstudantesMultiplo[i].to = `${inep}_${this.arrayOfEstudantesMultiplo[i].matricula}`;
    }
    this.gravarOcorrenciaDisciplinarMultiplaFirebase(this.arrayOfEstudantesMultiplo);



  }

  public gravarOcorrenciaDisciplinarMultiplaFirebase(messagesFirebase: Array<MessageFirebase>): void {
    this.feedbackUsuario = "Gravando ocorrências, aguarde...";
    for (let i = 0; i < messagesFirebase.length; i++) {
      let messageFirebase = messagesFirebase[i];
      this.firebaseService.gravarOcorrenciaDisciplinarFirebaseFirestore(messageFirebase).then((response: Response) => {
        messagesFirebase[i].firebase_dbkey = response["id"];
        this.arrayOfEstudantesMultiplo[i] = messagesFirebase[i];
      }).then(() => {
        const topicoPush = `${messageFirebase.cod_inep}_${messageFirebase.matricula}`;
        const tituloPush = "Ocorrência disciplinar";
        this.EnviarPushOcorrenciaMultipla(topicoPush, tituloPush, messagesFirebase[i].firebase_dbkey, messagesFirebase.length, i)
      }).catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      })
    }
  }

  public EnviarPushOcorrenciaMultipla(topico: string, titulo: string, firebase_dbkey: string, total: number, atual: number): void {
    this.feedbackUsuario = "Enviando notificação, aguarde...";
    if (firebase_dbkey != "") {
      this.firebaseService
        .enviarPushFirebase(topico, titulo)
        .toPromise()
        .then((response: Response) => {
          if (total - 1 == atual) {
            this.inserirMultipla();
          }
        }).
        catch((erro: Response) => {
          //Mostra modal
          this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
          //registra log de erro no firebase usando serviço singlenton
          this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
          //Caso token seja invalido, reenvia rota para login
          Utils.tratarErro({ router: this.router, response: erro });
          this.feedbackUsuario = undefined;
        });
    }
  }

  public inserirMultipla(): void {
    this.feedbackUsuario = "Salvando dados, aguarde...";
    this.ocorrencia.data_hora = Utils.now();
    this.ocorrencia.usr_id = JSON.parse(Utils.decriptAtoB(localStorage.getItem("dados"), CONSTANTES.PASSO_CRIPT))[0].id;
    this.ocorrencia.array_msg = this.arrayOfEstudantesMultiplo;
    this.ocorrenciaService
      .inserir(this.ocorrencia)
      .toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = undefined;
        this.limparDadosOcorrenciaMultipla();
      })
      .catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
        this.limparDadosOcorrenciaMultipla();
      });

  }
  //#endregion

  //#region ######################################### CONSULTAR OCORRENCIAS #################################################
  public gravarNomeOcorrencia(event: Event): void {
    this.nomeEstudanteOcorrenciaProcurado = (<HTMLInputElement>(
      event.target
    )).value;
  }

  public pesquisarOcorrencia(): void {
    this.filtrarOcorrencia();
  }

  public filtrarOcorrenciaEnter(event: KeyboardEvent) {
    if (event.key == "Enter") {
      this.filtrarOcorrencia();
    }
  }

  public filtrarOcorrencia(limit: number = 5, offset: number = 0): void {
    this.feedbackUsuario = "Procurando ocorrências, aguarde...";
    this.ocorrenciaService
      .filtrar(this.nomeEstudanteOcorrenciaProcurado, 5000, offset, this.esc_id)
      .toPromise()
      .then((response: Response) => {
        this.ocorrencias = Object.values(response);
        this.exibeBotaoImprimirOcorrenciasEstudante = this.exibirBotaoImprimir(this.ocorrencias);
        this.feedbackUsuario = undefined;
      })
      .catch((erro: Response) => {
        this.feedbackUsuario = undefined;
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
      });
  }

  /************************BLOCO DE CONSTRUÇÃO DO RELATÓRIO EM PDF************************/
  public imprimirOcorrencias(ocorrencias: Array<Object>): void {
    /*CRIA UMA NOVA INSTÂNCIA DO OBJETO jsPDF PARA O NOVO RELATÓRIO*/
    this.relatorioPDFOcorrenciasEstudante = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compressPdf: true,
    });

    this.feedbackUsuario = "Gerando relatório, aguarde...";
    if (ocorrencias != undefined && ocorrencias.length > 0) {

      let paginaAtual: number = 1;
      const xInicialLinha: number = 10;
      const xFinalLinha: number = 200;
      const larguraTextoPrimeiraColuna: number = 20;
      const larguraTextoSegundaColuna: number = 130;
      const larguraTextoTerceiraColuna: number = 20;

      //const larguraLinha: number = 10;
      let alturaInicialOcorrenciasPrimeiraPagina: number = 45;
      let alturaInicialOcorrenciasDemaisPaginas: number = 20;
      let contaLinhaOcorrenciaDisciplinar = 0;
      const distanciaLinhaSeparadoraLinhas = 5;
      const larguraLinhaRegistrosOcorrencia: number = 18;
      const ajusteAlturaPrimeiraLinha: number = 8;

      const inicioPrimeiraColuna: number = xInicialLinha;
      const inicioSegundaColuna: number = inicioPrimeiraColuna + 30;
      const inicioTerceiraColuna: number = inicioPrimeiraColuna + inicioSegundaColuna + 125;

      /*ADICIONAR IMAGEM ESTUDANTE*/
      html2canvas((<HTMLInputElement>document.getElementById(`img_${ocorrencias[0]["nome"]}`)), { useCORS: true }).then(canvas => {
        var imgData = canvas.toDataURL('image/jpeg');
        this.relatorioPDFOcorrenciasEstudante.addImage(imgData, 'JPEG', xInicialLinha, 20, 25, 25, ocorrencias[0]["nome"]);
        this.construirBordaNaPagina();

        /*ORDENANDO REGISTROS POR DATA E HORA*/
        ocorrencias.sort((a, b) => (a['data_hora'] > b['data_hora']) ? 1 : -1);

        /*CONSTRUTOR DO CABECALHO*/
        this.criarCabecalhoPDFOcorrenciasEstudante(xInicialLinha, xFinalLinha, ocorrencias);
        let paginaNova: boolean = true;

        /*OCORRÊNCIAS DISCIPLINARES*/
        for (let idxRegistroOcorrencia = 0; idxRegistroOcorrencia < ocorrencias.length; idxRegistroOcorrencia++) {

          /*ATUALIZA CAMPOS PARA ESCREVER PRÓXIMA PÁGINA DO RELATÓRIO*/
          if (idxRegistroOcorrencia % 11 == 0 && idxRegistroOcorrencia > 0) {
            this.relatorioPDFOcorrenciasEstudante.addPage();
            paginaAtual++;
            paginaNova = true;
            this.criarCabecalhoPDFOcorrenciasEstudantesPaginasSeguintes(xInicialLinha, xFinalLinha, ocorrencias, paginaAtual);
            contaLinhaOcorrenciaDisciplinar = 0;
            this.construirBordaNaPagina();
            alturaInicialOcorrenciasPrimeiraPagina = alturaInicialOcorrenciasDemaisPaginas;
          }
          const ocorr = ocorrencias[idxRegistroOcorrencia];
          const tipo = ocorr['tipo'];
          const ocorrencia = ocorr['ocorrencia'];
          const data_hora = ocorr['data_hora'];

          /*LINHA SEPARADORA DE OCORRENCIAS*/
          this.relatorioPDFOcorrenciasEstudante.line(
            xInicialLinha,
            alturaInicialOcorrenciasPrimeiraPagina - ajusteAlturaPrimeiraLinha + (larguraLinhaRegistrosOcorrencia * (contaLinhaOcorrenciaDisciplinar + 1)) - distanciaLinhaSeparadoraLinhas,
            xFinalLinha,
            alturaInicialOcorrenciasPrimeiraPagina - ajusteAlturaPrimeiraLinha + (larguraLinhaRegistrosOcorrencia * (contaLinhaOcorrenciaDisciplinar + 1)) - distanciaLinhaSeparadoraLinhas
          );

          /*TIPO*/
          this.relatorioPDFOcorrenciasEstudante.setFontSize(8);
          const textoTipo = this.relatorioPDFOcorrenciasEstudante.splitTextToSize(tipo, larguraTextoPrimeiraColuna);
          this.relatorioPDFOcorrenciasEstudante.text(
            inicioPrimeiraColuna,
            alturaInicialOcorrenciasPrimeiraPagina - ajusteAlturaPrimeiraLinha + larguraLinhaRegistrosOcorrencia * (contaLinhaOcorrenciaDisciplinar + 1),
            textoTipo
          );

          /*OCORRÊNCIA*/
          this.relatorioPDFOcorrenciasEstudante.setFontSize(8);
          const textoOcorrencia = this.relatorioPDFOcorrenciasEstudante.splitTextToSize(ocorrencia, larguraTextoSegundaColuna);
          this.relatorioPDFOcorrenciasEstudante.text(
            inicioSegundaColuna,
            alturaInicialOcorrenciasPrimeiraPagina - ajusteAlturaPrimeiraLinha + larguraLinhaRegistrosOcorrencia * (contaLinhaOcorrenciaDisciplinar + 1),
            textoOcorrencia
          );

          /*DATA E HORA*/
          this.relatorioPDFOcorrenciasEstudante.setFontSize(8);
          const textoDataHora = this.relatorioPDFOcorrenciasEstudante.splitTextToSize(data_hora, larguraTextoTerceiraColuna);
          this.relatorioPDFOcorrenciasEstudante.text(
            inicioTerceiraColuna,
            alturaInicialOcorrenciasPrimeiraPagina - ajusteAlturaPrimeiraLinha + larguraLinhaRegistrosOcorrencia * (contaLinhaOcorrenciaDisciplinar + 1),
            textoDataHora
          );
          contaLinhaOcorrenciaDisciplinar++;
          if (paginaNova) {
            /*RODAPÉ*/
            this.criarRodapePDFOcorrenciasEstudante(xInicialLinha, xFinalLinha, paginaAtual);
            /*ESPAÇO PARA ASSINATURA DO RESPONSÁVEL*/
            this.criarLocalAssinaturaResponsável(xInicialLinha, xFinalLinha);
          }
          paginaNova = false;
        }
        this.relatorioPDFOcorrenciasEstudante.save(`Relatorio_ocorrencias_${ocorrencias[0]['nome']}.pdf`);
        this.feedbackUsuario = undefined;
      });
    }

  }

  public construirBordaNaPagina(): void {
    this.relatorioPDFOcorrenciasEstudante.rect(2, 2,
      this.relatorioPDFOcorrenciasEstudante.internal.pageSize.width - 4,
      this.relatorioPDFOcorrenciasEstudante.internal.pageSize.height - 4,
      'S');
  }

  public criarCabecalhoPDFOcorrenciasEstudantesPaginasSeguintes(inicioLinha: number, fimLinha: number, ocorrencias: Array<Object>, pagina: number): void {
    /*CABEÇALHO PAGINAS SUBSEQUENTES*/
    /*-------------------------------------------------------------------------*/
    this.relatorioPDFOcorrenciasEstudante.setFontSize(10);
    this.relatorioPDFOcorrenciasEstudante.text('Sistema de Gestão Pedagógica - SupervisorEscolar®', 62, 7);
    this.relatorioPDFOcorrenciasEstudante.line(inicioLinha, 10, fimLinha, 10);
    /*-------------------------------------------------------------------------*/
    this.relatorioPDFOcorrenciasEstudante.setFontSize(10);
    this.relatorioPDFOcorrenciasEstudante.text(`Relatório de ocorrências disciplinares - pagina ${pagina}`, inicioLinha, 15);
    /*-------------------------------------------------------------------------*/
    this.relatorioPDFOcorrenciasEstudante.setFontSize(10);
    this.relatorioPDFOcorrenciasEstudante.text(ocorrencias[0]['nome'], inicioLinha, 22);
    /*-------------------------------------------------------------------------*/
  }

  public criarCabecalhoPDFOcorrenciasEstudante(inicioLinha: number, fimLinha: number, ocorrencias: Array<Object>): void {
    /*CABEÇALHO*/
    /*-------------------------------------------------------------------------*/
    this.relatorioPDFOcorrenciasEstudante.setFontSize(10);
    this.relatorioPDFOcorrenciasEstudante.text('Sistema de Gestão Pedagógica - SupervisorEscolar®', 62, 7);
    this.relatorioPDFOcorrenciasEstudante.line(inicioLinha, 10, fimLinha, 10);
    /*-------------------------------------------------------------------------*/
    this.relatorioPDFOcorrenciasEstudante.setFontSize(14);
    this.relatorioPDFOcorrenciasEstudante.text('Relatório de ocorrências disciplinares', 62, 20);
    /*-------------------------------------------------------------------------*/
    this.relatorioPDFOcorrenciasEstudante.setFontSize(14);
    this.relatorioPDFOcorrenciasEstudante.text(ocorrencias[0]['nome'], 50, 30);
    /*-------------------------------------------------------------------------*/
    this.relatorioPDFOcorrenciasEstudante.setFontSize(12);
    this.relatorioPDFOcorrenciasEstudante.text(ocorrencias[0]['serie'], 50, 40);
    /*-------------------------------------------------------------------------*/
    this.relatorioPDFOcorrenciasEstudante.setFontSize(12);
    this.relatorioPDFOcorrenciasEstudante.text(ocorrencias[0]['etapa'], 100, 40);
    /*-------------------------------------------------------------------------*/
    this.relatorioPDFOcorrenciasEstudante.setFontSize(12);
    this.relatorioPDFOcorrenciasEstudante.text(ocorrencias[0]['turma'], 125, 40);
    /*-------------------------------------------------------------------------*/
    this.relatorioPDFOcorrenciasEstudante.setFontSize(12);
    this.relatorioPDFOcorrenciasEstudante.text(ocorrencias[0]['turno'], 150, 40);
    /*-------------------------------------------------------------------------*/
    this.relatorioPDFOcorrenciasEstudante.line(inicioLinha, 50, fimLinha, 50);
  }

  public criarRodapePDFOcorrenciasEstudante(inicioLinha: number, fimLinha: number, pagina: number): void {
    this.relatorioPDFOcorrenciasEstudante.line(inicioLinha, 282, fimLinha, 282);
    this.relatorioPDFOcorrenciasEstudante.setFontSize(8);
    this.relatorioPDFOcorrenciasEstudante.text(`Documento gerado em ${Utils.now()}`, 72, 285);
    this.relatorioPDFOcorrenciasEstudante.text(`Página ${pagina}`, fimLinha - 15, 285);
  }

  public criarLocalAssinaturaResponsável(inicioLinha: number, fimLinha: number): void {
    this.relatorioPDFOcorrenciasEstudante.line(inicioLinha + 50, 272, fimLinha - 50, 272);
    this.relatorioPDFOcorrenciasEstudante.text(`Assinatura do Responsável`, 90, 275);
  }

  public exibirBotaoImprimir(ocorrencias: Array<Object>): boolean {
    if (ocorrencias.length > 0) {
      let nomeEstudante = ocorrencias[0]['nome'];
      for (let i = 0; i < ocorrencias.length; i++) {
        if (ocorrencias[i]['nome'] != nomeEstudante) {
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  }


}
