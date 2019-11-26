import { Component, OnInit } from '@angular/core';
import { TurnoService } from '../../turno/turno.service';
import { TurmaService } from '../../turma/turma.service';
import { EstudanteService } from '../../estudante/estudante.service';
import { ComunicadoDiversoService } from '../comunicado-diverso.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { ComunicadoDiverso } from '../comunicado-diverso.model';
import { Turno } from '../../turno/turno.model';
import { Turma } from '../../turma/turma.model';
import { Estudante } from '../../estudante/estudante.model';
import { MessageFirebase } from '../../../shared/firebase/message.model';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-inserir-comunicado-diverso',
  templateUrl: './inserir-comunicado-diverso.component.html',
  styleUrls: ['./inserir-comunicado-diverso.component.scss'],
  providers: [
    TurnoService,
    TurmaService,
    EstudanteService,
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
export class InserirComunicadoDiversoComponent implements OnInit {

  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public mensagemSelecionados: string = ""
  public comunicadoDiverso = new ComunicadoDiverso();

  public arrayOfTurnos = new Array<Turno>();
  public arrayOfTurmas = new Array<Turma>();
  public arrayOfEstudantes = new Array<Estudante>();
  public arrayOfComunicados = new Array<ComunicadoDiverso>();
  public arrayDeMensagens = new Array<MessageFirebase>()

  public esc_id: number;
  public usr_id: number;
  public inep: string;
  public dados_escola = new Object();
  public assunto: string = "";
  public mensagem: string = "";
  public trm_id: number;
  public anoAtual: number = new Date().getFullYear();
  public turnoSelecionado: number = -1; //Inicialmente, seleciona as turmas de todos os turnos.

  constructor(
    private turnoService: TurnoService,
    private turmaService: TurmaService,
    private estudanteService: EstudanteService,
    private comunicadoDiversoService: ComunicadoDiversoService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router

  ) { }

  ngOnInit() {
    this.esc_id = parseInt(
      Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT)
    );
    this.usr_id = JSON.parse(
      Utils.decriptAtoB(localStorage.getItem("dados"), CONSTANTES.PASSO_CRIPT)
    )[0].id;

    this.listarTurnos();
    this.listarTurmas();
    this.inep = Utils.pegarDadosEscola()["inep"];
  }

  public selecionarTurno(event: Event): void {
    this.turnoSelecionado = parseInt((<HTMLInputElement>event.target).value);
    this.listarTurmas();
  }

  public listarTurnos(): void {
    this.feedbackUsuario = "Carregando dados, aguarde...";
    this.turnoService
      .listar(this.esc_id)
      .toPromise()
      .then((response: Response) => {
        this.arrayOfTurnos = Object.values(response);
        this.feedbackUsuario = undefined;
      })
      .catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
        //Gravar erros no analytics
        Utils.gravarErroAnalytics(JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      });
  }

  public selecionarTurma(event: Event): void {
    this.trm_id = parseInt((<HTMLInputElement>event.target).value);
    this.feedbackUsuario = "Carregando dados, aguarde...";
    if (this.trm_id < 0) {
      //Seleciona todos os estudantes da escola
      this.estudanteService
        .listar(50000, 0, true, this.esc_id)
        .toPromise()
        .then((response: Response) => {
          this.arrayOfEstudantes = Object.values(response);
          this.feedbackUsuario = undefined;
        })
        .catch((erro: Response) => {
          //Mostra modal
          this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
          //registra log de erro no firebase usando serviço singlenton
          this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
          //Gravar erros no analytics
          Utils.gravarErroAnalytics(JSON.stringify(erro));
          //Caso token seja invalido, reenvia rota para login
          Utils.tratarErro({ router: this.router, response: erro });
          this.feedbackUsuario = undefined;
        });
    } else {
      //Seleciona todos os estudantes da turma selecionada
      this.feedbackUsuario = "Carregando dados, aguarde...";
      this.estudanteService
        .listarTurmaId(this.trm_id)
        .toPromise()
        .then((response: Response) => {
          this.arrayOfEstudantes = Object.values(response);
          this.feedbackUsuario = undefined;
        })
        .catch((erro: Response) => {
          //Mostra modal
          this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
          //registra log de erro no firebase usando serviço singlenton
          this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
          //Gravar erros no analytics
          Utils.gravarErroAnalytics(JSON.stringify(erro));
          //Caso token seja invalido, reenvia rota para login
          Utils.tratarErro({ router: this.router, response: erro });
          this.feedbackUsuario = undefined;
        });
    }
  }

  public listarTurmas(): void {
    this.feedbackUsuario = "Carregando dados, aguarde...";
    this.turmaService
      .listarTurnoId(this.turnoSelecionado, this.esc_id, this.anoAtual)
      .toPromise()
      .then((response: Response) => {
        this.arrayOfTurmas = Object.values(response);
        this.feedbackUsuario = undefined;
      })
      .catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
        //Gravar erros no analytics
        Utils.gravarErroAnalytics(JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      });
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

  public listar(): void {
    this.router.navigate(["listar-comunicado-diverso"]);
  }

  public gravarAssunto(event: Event): void {
    this.assunto = (<HTMLInputElement>event.target).value;
  }

  public gravarMensagem(event: Event): void {
    this.mensagem = (<HTMLInputElement>event.target).value;
  }

  public adicionarComunicado(event: Event): void {
    let est_id = parseInt((<HTMLInputElement>event.target).id);
    let comunicado = new ComunicadoDiverso();
    let status_check = (<HTMLInputElement>event.target).checked;
    comunicado.assunto = this.assunto;
    comunicado.data_comunicado = new Date().getFullYear().toString() + "-" + ("0" + (new Date().getMonth() + 1)).slice(-2).toString() + "-" + ("0" + new Date().getDate()).slice(-2).toString();
    comunicado.est_id = est_id;
    comunicado.fbdbkey = "";
    comunicado.hora = ("0" + new Date().getHours()).slice(-2).toString() + ":" + ("0" + new Date().getMinutes()).slice(-2).toString() + ":00";
    comunicado.mensagem = this.mensagem;
    comunicado.status_comunicado = 0;
    comunicado.usr_id = this.usr_id;

    if (status_check == true) {
      if (!this.verificarComunicadoExistente(comunicado)) {
        this.arrayOfComunicados.push(comunicado);
      }
    } else {
      let idx_comunicado: number = this.removerComunicadoExistente(comunicado);
      this.arrayOfComunicados.splice(idx_comunicado, 1);
    }
    if (this.arrayOfComunicados.length > 0) {
      this.mensagemSelecionados = this.arrayOfComunicados.length.toString() + " de " + this.arrayOfEstudantes.length.toString();
    } else {
      this.mensagemSelecionados = ""
    }
  }

  public verificarComunicadoExistente(comunicado: ComunicadoDiverso): boolean {
    let retorno: boolean = false;
    for (let i = 0; i < this.arrayOfComunicados.length; i++) {
      if (comunicado.est_id != this.arrayOfComunicados[i].est_id) {
        retorno = false;
      } else {
        retorno = true;
      }
    }
    return retorno;
  }

  public removerComunicadoExistente(comunicado: ComunicadoDiverso): number {
    let retorno: number = -1;
    for (let i = 0; i < this.arrayOfComunicados.length; i++) {
      if (comunicado.est_id == this.arrayOfComunicados[i].est_id) {
        return i;
      }
    }
    return retorno;
  }

  public enviarComunicado(): void {
    this.atualizarAssuntoMensagem();
    this.feedbackUsuario = "Montando mensagens, aguarde...";
    if (this.assunto.trim() != "" && this.mensagem.trim() != "" && this.arrayOfComunicados.length > 0) {
      this.montarMensagem();
    } else {
      this.feedbackUsuario = undefined;
      this.alertModalService.showAlertWarning("Informe o assunto e o conteúdo da mensagem e selecione ao menos um destinatário.");
    }
  }

  public atualizarAssuntoMensagem(): void {
    for (let i = 0; i < this.arrayOfComunicados.length; i++) {
      this.arrayOfComunicados[i].assunto = this.assunto;
      this.arrayOfComunicados[i].mensagem = this.mensagem;
    }
  }

  public selecionarTodosEstudantes(event: Event): void {
    let checkEstudantes = document.getElementsByClassName("checkbox");
    this.arrayOfComunicados = []
    for (let i = 0; i < checkEstudantes.length; i++) {
      if (!isNaN(parseInt(checkEstudantes[i].id))) {
        if ((<HTMLInputElement>event.target).checked == true) {
          (<HTMLInputElement>document.getElementsByClassName("checkbox")[i]).checked = (<HTMLInputElement>event.target).checked;
          let comunicado = new ComunicadoDiverso();
          comunicado.assunto = this.assunto;
          comunicado.data_comunicado = new Date().getFullYear().toString() + "-" + ("0" + (new Date().getMonth() + 1)).slice(-2).toString() + "-" + ("0" + new Date().getDate()).slice(-2).toString();
          comunicado.est_id = parseInt(checkEstudantes[i].id);
          comunicado.fbdbkey = "";
          comunicado.hora = ("0" + new Date().getHours()).slice(-2).toString() + ":" + ("0" + new Date().getMinutes()).slice(-2).toString() + ":00";
          comunicado.mensagem = this.mensagem;
          comunicado.status_comunicado = 0;
          comunicado.usr_id = this.usr_id;
          this.arrayOfComunicados.push(comunicado);
        } else {
          (<HTMLInputElement>document.getElementsByClassName("checkbox")[i]).checked = (<HTMLInputElement>event.target).checked;
        }
      }
    }
    if (this.arrayOfComunicados.length > 0) {
      this.mensagemSelecionados = this.arrayOfComunicados.length.toString() + " de " + this.arrayOfEstudantes.length.toString();
    } else {
      this.mensagemSelecionados = ""
    }
  }

  public montarMensagem(): void {
    let dados_escola = JSON.parse(Utils.decriptAtoB(localStorage.getItem("dados_escola"), CONSTANTES.PASSO_CRIPT));
    let inep = dados_escola[0]["inep"];
    let telefone = dados_escola[0]["telefone"];

    this.arrayDeMensagens = [];
    for (let i = 0; i < this.arrayOfEstudantes.length; i++) {
      for (let j = 0; j < this.arrayOfComunicados.length; j++) {
        if (this.arrayOfEstudantes[i].id == this.arrayOfComunicados[j].est_id) {
          let matricula = this.arrayOfEstudantes[i].matricula;
          let nome = this.arrayOfEstudantes[i].nome;
          let messageFirebase = new MessageFirebase();
          messageFirebase.cod_inep = inep;
          messageFirebase.data = new Date().getFullYear().toString() + "-" + ("0" + (new Date().getMonth() + 1)).slice(-2).toString() + "-" + ("0" + new Date().getDate()).slice(-2).toString();
          messageFirebase.data_versao = Utils.now();
          messageFirebase.firebase_dbkey = "";
          messageFirebase.hora = ("0" + new Date().getHours()).slice(-2).toString() + ":" + ("0" + new Date().getMinutes()).slice(-2).toString() + ":00";
          messageFirebase.id = this.arrayOfEstudantes[i].id.toString();
          messageFirebase.matricula = matricula;
          messageFirebase.msg = `${this.mensagem}`;
          messageFirebase.msg_tag = "0";
          messageFirebase.nome_estudante = nome;
          messageFirebase.tipo_msg = "Comunicado escolar";
          messageFirebase.titulo = this.assunto;
          messageFirebase.to = `${inep}_${matricula}`;
          this.arrayDeMensagens.push(messageFirebase);
        }
      }
    }
    this.gravarComunicadoDirecao(this.arrayDeMensagens);
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
        const tituloPush = "Comunicado da direção";
        this.EnviarPushComunicadoSimples(topicoPush, tituloPush, messageFirebase.firebase_dbkey, messagesFirebase.length, i, messageFirebase);
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
  }

  public EnviarPushComunicadoSimples(topico: string, titulo: string, firebase_dbkey: string, total: number, atual: number, messageFirebase: MessageFirebase): void {
    this.feedbackUsuario = `Enviando notificação ${atual} de ${total}, aguarde...`;
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
          this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
          //Gravar erros no analytics
          Utils.gravarErroAnalytics(JSON.stringify(erro));
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
    this.comunicadoDiverso.est_id = parseInt(messageFirebase.id);
    this.comunicadoDiverso.usr_id = JSON.parse(Utils.decriptAtoB(localStorage.getItem("dados"), CONSTANTES.PASSO_CRIPT))[0].id;
    this.comunicadoDiversoService.inserir(this.comunicadoDiverso).toPromise().then((response: Response) => {
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
      this.feedbackUsuario = undefined;
    })
  }

  public inserir(): void {
    this.feedbackUsuario = "Finalizando, aguarde...";
    let comunicadosDiversos = new Array<ComunicadoDiverso>();
    for (let i = 0; i < this.arrayDeMensagens.length; i++) {
      let comunicadoDiverso = new ComunicadoDiverso();
      comunicadoDiverso.assunto = this.arrayDeMensagens[i].titulo;
      comunicadoDiverso.data_comunicado = new Date().getFullYear().toString() + "-" + ("0" + (new Date().getMonth() + 1)).slice(-2).toString() + "-" + ("0" + new Date().getDate()).slice(-2).toString();
      comunicadoDiverso.est_id = parseInt(this.arrayDeMensagens[i].id);
      comunicadoDiverso.fbdbkey = this.arrayDeMensagens[i].firebase_dbkey;
      comunicadoDiverso.hora = this.arrayDeMensagens[i].hora;
      comunicadoDiverso.mensagem = this.arrayDeMensagens[i].msg;
      comunicadoDiverso.status_comunicado = 0;
      comunicadoDiverso.usr_id = this.usr_id;
      comunicadosDiversos.push(comunicadoDiverso);
    }

    this.comunicadoDiversoService.inserirMuitos(comunicadosDiversos).toPromise().then((response: Response) => {
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
  }

}
