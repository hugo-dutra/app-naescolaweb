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
import { FirebaseUpload } from '../../../shared/firebase/firebase.upload.model';

@Component({
  selector: 'ngx-inserir-comunicado-diverso',
  templateUrl: './inserir-comunicado-diverso.component.html',
  styleUrls: ['./inserir-comunicado-diverso.component.scss'],
  providers: [
    TurnoService,
    TurmaService,
    EstudanteService,
    ComunicadoDiversoService,
  ],
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
export class InserirComunicadoDiversoComponent implements OnInit {

  public feedbackUsuario: string;
  public estado: string = 'visivel';
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public mensagemSelecionados: string = '';
  public comunicadoDiverso = new ComunicadoDiverso();

  public arrayOfTurnos = new Array<Turno>();
  public arrayOfTurmas = new Array<Turma>();
  public arrayOfEstudantes = new Array<Estudante>();
  public arrayOfComunicados = new Array<ComunicadoDiverso>();
  public arrayDeMensagens = new Array<MessageFirebase>();

  public esc_id: number;
  public usr_id: number;
  public inep: string;
  public dados_escola = new Object();
  public assunto: string = '';
  public mensagem: string = '';
  public trm_id: number;
  public anoAtual: number = new Date().getFullYear();
  public turnoSelecionado: number = -1; // Inicialmente, seleciona as turmas de todos os turnos.
  public arrayDeDadosDosAnexos = new Array<Object>();

  constructor(
    private turnoService: TurnoService,
    private turmaService: TurmaService,
    private estudanteService: EstudanteService,
    private comunicadoDiversoService: ComunicadoDiversoService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router,

  ) { }

  ngOnInit() {
    this.esc_id = parseInt(
      Utils.decriptAtoB(localStorage.getItem('esc_id'), CONSTANTES.PASSO_CRIPT), 10);
    this.usr_id = JSON.parse(
      Utils.decriptAtoB(localStorage.getItem('dados'), CONSTANTES.PASSO_CRIPT),
    )[0].id;
    this.listarTurnos();
    this.listarTurmas();
    this.inep = Utils.pegarDadosEscola()['inep'];
    this.arrayDeDadosDosAnexos = [];
  }

  public selecionarTurno(event: Event): void {
    this.turnoSelecionado = parseInt((<HTMLInputElement>event.target).value, 10);
    this.listarTurmas();
  }

  public tratarErro(erro: Response): void {
    // Mostra modal
    this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
    // registra log de erro no firebase usando servi??o singlenton
    this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`,
      JSON.stringify(erro));
    // Gravar erros no analytics
    Utils.gravarErroAnalytics(JSON.stringify(erro));
    // Caso token seja invalido, reenvia rota para login
    Utils.tratarErro({ router: this.router, response: erro });
    this.feedbackUsuario = undefined;
  }

  public listarTurnos(): void {
    this.feedbackUsuario = 'Carregando dados, aguarde...';
    this.turnoService
      .listar(this.esc_id)
      .toPromise()
      .then((response: Response) => {
        this.arrayOfTurnos = Object.values(response);
        this.feedbackUsuario = undefined;
      })
      .catch((erro: Response) => {
        this.tratarErro(erro);
      });
  }

  public selecionarTurma(event: Event): void {
    this.trm_id = parseInt((<HTMLInputElement>event.target).value, 10);
    this.feedbackUsuario = 'Carregando dados, aguarde...';
    /* Para todos os turnos */
    if (this.turnoSelecionado == -1) {
      if (this.trm_id < 0) {
        // Seleciona todos os estudantes da escola
        this.estudanteService
          .listar(50000, 0, true, this.esc_id)
          .toPromise()
          .then((response: Response) => {
            this.arrayOfEstudantes = Object.values(response);
            this.feedbackUsuario = undefined;
          })
          .catch((erro: Response) => {
            this.tratarErro(erro);
          });
      } else {
        // Seleciona todos os estudantes da turma selecionada
        this.feedbackUsuario = 'Carregando dados, aguarde...';
        this.estudanteService
          .listarTurmaId(this.trm_id)
          .toPromise()
          .then((response: Response) => {
            this.arrayOfEstudantes = Object.values(response);
            this.feedbackUsuario = undefined;
          })
          .catch((erro: Response) => {
            this.tratarErro(erro);
          });
      }
    } else {
      /* Para um turno espec??fico */
      if (this.trm_id == -1) {
        this.estudanteService.listarTurnoId(this.turnoSelecionado).toPromise().then((response: Response) => {
          this.arrayOfEstudantes = Object.values(response);
          this.feedbackUsuario = undefined;
        });
      } else {
        this.feedbackUsuario = 'Carregando dados, aguarde...';
        this.estudanteService
          .listarTurmaId(this.trm_id)
          .toPromise()
          .then((response: Response) => {
            this.arrayOfEstudantes = Object.values(response);
            this.feedbackUsuario = undefined;
          })
          .catch((erro: Response) => {
            this.tratarErro(erro);
          });
      }
    }
  }

  public listarTurmas(): void {
    if ((<HTMLInputElement>document.getElementById('select-turma'))) {
      (<HTMLInputElement>document.getElementById('select-turma')).value = 'Selecione uma turma';
      this.feedbackUsuario = 'Carregando dados, aguarde...';
      this.turmaService
        .listarTurnoId(this.turnoSelecionado, this.esc_id, this.anoAtual)
        .toPromise()
        .then((response: Response) => {
          this.arrayOfTurmas = Object.values(response);
          this.feedbackUsuario = undefined;
        })
        .catch((erro: Response) => {
          this.tratarErro(erro);
        });
    }


  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

  public listar(): void {
    this.router.navigate(['listar-comunicado-diverso']);
  }

  public gravarAssunto(event: Event): void {
    this.assunto = (<HTMLInputElement>event.target).value;
  }

  public gravarMensagem(event: Event): void {
    this.mensagem = (<HTMLInputElement>event.target).value;
  }

  public adicionarComunicado(event: Event): void {
    const est_id = parseInt((<HTMLInputElement>event.target).id, 10);
    const comunicado = new ComunicadoDiverso();
    const status_check = (<HTMLInputElement>event.target).checked;
    comunicado.assunto = this.assunto;
    comunicado.data_comunicado = new Date().getFullYear().toString() + '-' +
      ('0' + (new Date().getMonth() + 1)).slice(-2).toString() + '-' +
      ('0' + new Date().getDate()).slice(-2).toString();
    comunicado.est_id = est_id;
    comunicado.fbdbkey = '';
    comunicado.hora = ('0' + new Date().getHours()).slice(-2).toString() +
      ':' + ('0' + new Date().getMinutes()).slice(-2).toString() + ':00';
    comunicado.mensagem = this.mensagem;
    comunicado.status_comunicado = 0;
    comunicado.usr_id = this.usr_id;

    if (status_check == true) {
      if (!this.verificarComunicadoExistente(comunicado)) {
        this.arrayOfComunicados.push(comunicado);
      }
    } else {
      const idx_comunicado: number = this.removerComunicadoExistente(comunicado);
      this.arrayOfComunicados.splice(idx_comunicado, 1);
    }
    if (this.arrayOfComunicados.length > 0) {
      this.mensagemSelecionados = this.arrayOfComunicados.length.toString() +
        ' de ' + this.arrayOfEstudantes.length.toString();
    } else {
      this.mensagemSelecionados = '';
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
    const retorno: number = -1;
    for (let i = 0; i < this.arrayOfComunicados.length; i++) {
      if (comunicado.est_id == this.arrayOfComunicados[i].est_id) {
        return i;
      }
    }
    return retorno;
  }

  public enviarComunicado(): void {
    this.atualizarAssuntoMensagem();
    this.feedbackUsuario = 'Montando mensagens, aguarde...';
    if (this.assunto.trim() != '' && this.mensagem.trim() != '' && this.arrayOfComunicados.length > 0) {
      this.montarMensagem();
    } else {
      this.feedbackUsuario = undefined;
      this.alertModalService.
        showAlertWarning('Informe o assunto e o conte??do da mensagem e selecione ao menos um destinat??rio.');
    }
  }

  public atualizarAssuntoMensagem(): void {
    for (let i = 0; i < this.arrayOfComunicados.length; i++) {
      this.arrayOfComunicados[i].assunto = this.assunto;
      this.arrayOfComunicados[i].mensagem = this.mensagem;
    }
  }

  public selecionarTodosEstudantes(event: Event): void {
    const checkEstudantes = document.getElementsByClassName('form-check-input');
    this.arrayOfComunicados = [];
    for (let i = 0; i < checkEstudantes.length; i++) {
      if (!isNaN(parseInt(checkEstudantes[i].id, 10))) {
        if ((<HTMLInputElement>event.target).checked == true) {
          (<HTMLInputElement>document.getElementsByClassName('form-check-input')[i])
            .checked = (<HTMLInputElement>event.target).checked;
          const comunicado = new ComunicadoDiverso();
          comunicado.assunto = this.assunto;
          comunicado.data_comunicado = new Date().getFullYear().toString()
            + '-' + ('0' + (new Date().getMonth() + 1)).slice(-2).toString() +
            '-' + ('0' + new Date().getDate()).slice(-2).toString();
          comunicado.est_id = parseInt(checkEstudantes[i].id, 10);
          comunicado.fbdbkey = '';
          comunicado.hora = ('0' + new Date().getHours()).slice(-2).toString() +
            ':' + ('0' + new Date().getMinutes()).slice(-2).toString() + ':00';
          comunicado.mensagem = this.mensagem;
          comunicado.status_comunicado = 0;
          comunicado.usr_id = this.usr_id;
          this.arrayOfComunicados.push(comunicado);
        } else {
          (<HTMLInputElement>document.getElementsByClassName('form-check-input')[i])
            .checked = (<HTMLInputElement>event.target).checked;
        }
      }
    }
    if (this.arrayOfComunicados.length > 0) {
      this.mensagemSelecionados = this.arrayOfComunicados.length.toString() +
        ' de ' + this.arrayOfEstudantes.length.toString();
    } else {
      this.mensagemSelecionados = '';
    }
  }

  public montarMensagem(): void {
    const dados_escola = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados_escola'), CONSTANTES.PASSO_CRIPT));
    const inep = dados_escola[0]['inep'];
    const telefone = dados_escola[0]['telefone'];

    this.arrayDeMensagens = [];
    for (let i = 0; i < this.arrayOfEstudantes.length; i++) {
      for (let j = 0; j < this.arrayOfComunicados.length; j++) {
        if (this.arrayOfEstudantes[i].id == this.arrayOfComunicados[j].est_id) {
          const est_id = this.arrayOfEstudantes[i].id;
          const nome = this.arrayOfEstudantes[i].nome;
          const messageFirebase = new MessageFirebase();
          messageFirebase.cod_inep = inep;
          messageFirebase.data = new Date().getFullYear().toString() + '-' +
            ('0' + (new Date().getMonth() + 1)).slice(-2).toString() + '-' +
            ('0' + new Date().getDate()).slice(-2).toString();
          messageFirebase.data_versao = Utils.now();
          messageFirebase.firebase_dbkey = '';
          messageFirebase.hora = ('0' + new Date().getHours()).slice(-2).toString() +
            ':' + ('0' + new Date().getMinutes()).slice(-2).toString() + ':00';
          messageFirebase.est_id = this.arrayOfEstudantes[i].id.toString();
          messageFirebase.est_id = this.arrayOfEstudantes[i].id.toString();
          messageFirebase.msg = `${this.mensagem}`;
          messageFirebase.msg_tag = '0';
          messageFirebase.nome_estudante = nome;
          messageFirebase.tipo_msg = 'Comunicado escolar';
          messageFirebase.titulo = this.assunto;
          messageFirebase.to = `${inep}_${est_id}`;
          this.arrayDeMensagens.push(messageFirebase);
        }
      }
    }
    this.gravarComunicadoDirecao(this.arrayDeMensagens);
  }

  public gravarComunicadoDirecao(messagesFirebase: Array<MessageFirebase>): void {
    this.feedbackUsuario = 'Gravando comunicado, aguarde...';
    for (let i = 0; i < messagesFirebase.length; i++) {
      const messageFirebase = messagesFirebase[i];
      this.firebaseService.gravarComunicadoDirecaoFirebaseFirestore(messageFirebase, this.arrayDeDadosDosAnexos)
        .then((response: Response) => {
          messageFirebase.firebase_dbkey = response['id'];
        }).then(() => {
          this.feedbackUsuario = undefined;
          const topicoPush = `${messageFirebase.cod_inep}_${messageFirebase.est_id}`;
          const tituloPush = 'Comunicado da dire????o';
          this.EnviarPushComunicadoSimples(topicoPush, tituloPush,
            messageFirebase.firebase_dbkey, messagesFirebase.length, i, messageFirebase);
        }).catch((erro: Response) => {
          this.tratarErro(erro);
        });
    }
  }

  public EnviarPushComunicadoSimples(topico: string, titulo: string,
    firebase_dbkey: string, total: number, atual: number, messageFirebase: MessageFirebase): void {
    this.feedbackUsuario = `Enviando notifica????o ${atual} de ${total}, aguarde...`;
    if (firebase_dbkey != '') {
      this.firebaseService
        .enviarPushFirebase(topico, titulo)
        .toPromise()
        .then(() => {
          if (total - 1 == atual) {
            this.inserir();
          }
        }).
        catch((erro: Response) => {
          this.tratarErro(erro);
        });
    }
  }

  /* public gravarComunicadoDiverso(messageFirebase: MessageFirebase): void {
    this.feedbackUsuario = 'Finalizando comunicado, aguarde...';
    this.comunicadoDiverso.assunto = messageFirebase.titulo;
    this.comunicadoDiverso.data_comunicado = new Date().getFullYear().toString() +
      '-' + ('0' + (new Date().getMonth() + 1)).slice(-2).toString() + '-' +
      ('0' + new Date().getDate()).slice(-2).toString(); // Ajuste no formato da data.
    this.comunicadoDiverso.fbdbkey = messageFirebase.firebase_dbkey;
    this.comunicadoDiverso.hora = messageFirebase.hora;
    this.comunicadoDiverso.mensagem = messageFirebase.msg;
    this.comunicadoDiverso.status_comunicado = 0;
    this.comunicadoDiverso.est_id = parseInt(messageFirebase.est_id, 10);
    this.comunicadoDiverso.usr_id = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados'),
      CONSTANTES.PASSO_CRIPT))[0].id;
    this.comunicadoDiversoService.inserir(this.comunicadoDiverso).toPromise().then((response: Response) => {
      this.feedbackUsuario = undefined;
    }).catch((erro: Response) => {
      this.tratarErro(erro);
    });
  } */

  public inserir(): void {
    this.feedbackUsuario = 'Finalizando, aguarde...';
    const comunicadosDiversos = new Array<ComunicadoDiverso>();
    for (let i = 0; i < this.arrayDeMensagens.length; i++) {
      const comunicadoDiverso = new ComunicadoDiverso();
      comunicadoDiverso.assunto = this.arrayDeMensagens[i].titulo;
      comunicadoDiverso.data_comunicado = new Date().getFullYear().toString() +
        '-' + ('0' + (new Date().getMonth() + 1)).slice(-2).toString() + '-' +
        ('0' + new Date().getDate()).slice(-2).toString();
      comunicadoDiverso.est_id = parseInt(this.arrayDeMensagens[i].est_id, 10);
      comunicadoDiverso.fbdbkey = this.arrayDeMensagens[i].firebase_dbkey;
      comunicadoDiverso.hora = this.arrayDeMensagens[i].hora;
      comunicadoDiverso.mensagem = this.arrayDeMensagens[i].msg;
      comunicadoDiverso.status_comunicado = 0;
      comunicadoDiverso.usr_id = this.usr_id;
      comunicadosDiversos.push(comunicadoDiverso);
    }

    this.comunicadoDiversoService.inserirMuitos(comunicadosDiversos).toPromise().then((response: Response) => {
      this.feedbackUsuario = undefined;
      this.alertModalService.showAlertSuccess('Opera????o finalizada com sucesso!');
    }).catch((erro: Response) => {
      this.tratarErro(erro);
    });
  }

  public selecionarArquivos(event: Event): void {
    const arquivosSelecionados: FileList = (<HTMLInputElement>event.target).files;
    let contadorArquivosEnviados = 0;
    Array.from(arquivosSelecionados).forEach(arquivo => {
      const firebaseUpload = new FirebaseUpload(arquivo);
      firebaseUpload.name = Utils.gerarNomeUnico();
      this.feedbackUsuario = 'Anexando, aguarde...';
      const basePath: string = `${CONSTANTES.FIREBASE_STORAGE_BASE_PATH}/${CONSTANTES.FIREBASE_STORAGE_ANEXOS}`;
      this.firebaseService.enviarArquivoFirebase(firebaseUpload, basePath).then(() => {
        this.feedbackUsuario = `Anexando ${contadorArquivosEnviados + 1} de
        ${arquivosSelecionados.length}, aguarde... `;
        this.firebaseService.pegarUrlArquivoUpload(firebaseUpload, basePath).then((url_download) => {
          const anexo = new Object();
          anexo['nome'] = arquivo.name;
          anexo['tamanho'] = arquivo.size;
          anexo['tipo'] = arquivo.name.split('.')[arquivo.name.split('.').length - 1];
          anexo['url'] = url_download;
          this.arrayDeDadosDosAnexos.push(anexo);
          contadorArquivosEnviados++;
          if (contadorArquivosEnviados == arquivosSelecionados.length) {
            this.feedbackUsuario = undefined;
            this.alertModalService.showAlertInformation('Arquivos anexados');
          }
        }).catch((erro: Response) => {
          this.tratarErro(erro);
        });
      }).catch((erro: Response) => {
        this.tratarErro(erro);
      });
    });
  }

  public excluirArquivoAnexado(nomeArquivo: string): void {
    this.arrayDeDadosDosAnexos = this.arrayDeDadosDosAnexos.filter(anexo => {
      return anexo['nome'] != nomeArquivo;
    });
  }
}
