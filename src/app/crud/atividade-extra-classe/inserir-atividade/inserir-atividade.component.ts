import { MessageFirebase } from './../../../shared/firebase/message.model';
import { AtividadeExtraEstudante } from './../atividade-extra-estudante.model';
import { AtividadeExtraClasse } from './../atividade-extra-classe.model';
import { AtividadeExtraClasseService } from './../atividade-extra-classe.service';
import { EstudanteService } from './../../estudante/estudante.service';
import { ProfessorDisciplinaService } from './../../professor-disciplina/professor-disciplina.service';
import { Router } from '@angular/router';
import { FirebaseService } from './../../../shared/firebase/firebase.service';
import { AlertModalService } from './../../../shared-module/alert-modal.service';
import { TurmaService } from './../../turma/turma.service';
import { TurnoService } from './../../turno/turno.service';
import { Component, OnInit } from '@angular/core';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Utils } from '../../../shared/utils.shared';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FirebaseUpload } from '../../../shared/firebase/firebase.upload.model';

@Component({
  selector: 'ngx-inserir-atividade',
  templateUrl: './inserir-atividade.component.html',
  styleUrls: ['./inserir-atividade.component.scss'],
  providers: [
    ProfessorDisciplinaService,
    TurnoService,
    TurmaService,
    EstudanteService,
    AtividadeExtraClasseService,
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
export class InserirAtividadeComponent implements OnInit {

  public feedbackUsuario: string;
  public estado: string = 'visivel';
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;


  public escId: number;
  public usrId: number;
  public remetenteAtividade: string = '';
  public anoAtual: number;
  public trnId: number;
  public prdId: number;
  public nomeProfessor: string = '';
  public nomeDisciplina: string = '';
  public tituloAtividade: string = '';
  public dataEntrega: string = '';
  public instrucoesAtividade: string = '';
  public inep: string = '';
  public arrayDeTurnos = new Array<Object>();
  public arrayDeProfessorDisciplina = new Array<Object>();
  public arrayDeTurmas = new Array<Object>();
  public arrayDeTurmasSelecionadas = new Array<Object>();
  public arrayDeEstudantes = new Array<Object>();
  public arrayDeEstudantesSelecionados = new Array<Object>();
  public arrayDeDadosDosAnexos = new Array<Object>();

  constructor(
    private professorDisciplinaService: ProfessorDisciplinaService,
    private turnoService: TurnoService,
    private turmaService: TurmaService,
    private estudanteService: EstudanteService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router,
    private atividadeExtraClasseService: AtividadeExtraClasseService,
  ) { }

  ngOnInit() {
    this.carregarDados();
    this.carregarListagens();
  }

  public carregarDados(): void {
    this.escId = Utils.pegarDadosEscolaDetalhado().id;
    this.usrId = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados'), CONSTANTES.PASSO_CRIPT))[0].id;
    this.remetenteAtividade = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados'),
      CONSTANTES.PASSO_CRIPT))[0].nome;
    this.inep = Utils.pegarDadosEscolaDetalhado().inep;
    this.anoAtual = (new Date()).getFullYear();
  }

  public carregarListagens(): void {
    this.feedbackUsuario = 'Carregando dados, aguarde...';
    this.listarTurnos().then(() => {
      this.listarProfessorDisciplina().then(() => {
        this.feedbackUsuario = undefined;
      });
    }).catch((erro: Response) => {
      this.tratarErro(erro);
    });
  }

  public listarTurmas(): void {
    this.feedbackUsuario = 'Carregando turmas, aguarde...';
    this.turmaService.listarTurnoId(this.trnId, this.escId, this.anoAtual).toPromise().then((response: Response) => {
      this.arrayDeTurmas = Object.values(response);
      this.feedbackUsuario = undefined;
    }).catch((erro: Response) => {
      this.tratarErro(erro);
    });
  }

  public listarProfessorDisciplina(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.professorDisciplinaService.listarDisciplina(this.escId, true).toPromise().then((response: Response) => {
        this.arrayDeProfessorDisciplina = Object.values(response);
        resolve('ok');
      }).catch((erro: Response) => {
        reject(erro);
      });
    });
  }

  public listarTurnos(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.turnoService.listar(this.escId).toPromise().then((response: Response) => {
        this.arrayDeTurnos = Object.values(response);
        resolve('ok');
      }).catch((erro: Response) => {
        reject(erro);
      });
    });
  }

  public selecionarTurno(): void {
    this.feedbackUsuario = 'Carregando turmas, aguarde...';
    this.turmaService.listarTurnoId(this.trnId, this.escId, this.anoAtual).toPromise().then((response: Response) => {
      this.arrayDeTurmas = Object.values(response);
      this.arrayDeTurmasSelecionadas = [];
      this.arrayDeEstudantes = [];
      (<HTMLInputElement>document.getElementById('selecionar_todas_turmas')).checked = false;
      (<HTMLInputElement>document.getElementById('selecionar_todos_estudantes')).checked = false;
      this.feedbackUsuario = undefined;
    }).catch((erro: Response) => {
      this.tratarErro(erro);
    });
  }

  public selecionarTodasTurmas(event: Event): void {
    const status = (<HTMLInputElement>event.target).checked;
    const checkTurmas = document.getElementsByClassName('turmas_disponiveis');
    if (status) {
      this.arrayDeTurmasSelecionadas = this.arrayDeTurmas.map((valor) => {
        return valor['id'];
      });
      Array.from(checkTurmas).forEach(turma => {
        (<HTMLInputElement>turma).checked = true;
      });
      this.selecionarTodosEstudantesTurno();
    } else {
      this.arrayDeTurmasSelecionadas = [];
      this.arrayDeEstudantes = [];
      Array.from(checkTurmas).forEach(turma => {
        (<HTMLInputElement>turma).checked = false;
      });
    }
  }

  public selecionarTodosEstudantesTurno(): void {
    if (this.trnId > 0) {
      this.feedbackUsuario = 'Carregando dados, aguarde...';
      this.estudanteService.listarTurnoId(this.trnId).toPromise().then((response: Response) => {
        this.arrayDeEstudantes = Object.values(response);
        this.feedbackUsuario = undefined;
      }).catch((erro: Response) => {
        this.tratarErro(erro);
      });
    } else {
      this.feedbackUsuario = 'Carregando dados, aguarde...';
      this.estudanteService.listar(50000, 0, true, this.escId).toPromise().then((response: Response) => {
        this.arrayDeEstudantes = Object.values(response).map((valor) => {
          return {
            id: valor['id'],
            nome: valor['nome'],
            foto: valor['foto'],
            trm_id: valor['trm_id'],
            numero_chamada: 0,
            data_nascimento: valor['nascimento'],
          };
        });
        this.feedbackUsuario = undefined;
      }).catch((erro: Response) => {
        this.tratarErro(erro);
      });
    }
  }

  public selecionarTodosEstudantes(event: Event): void {
    const status = (<HTMLInputElement>event.target).checked;
    const checkEstudantes = document.getElementsByClassName('estudantes_disponiveis');
    if (status) {
      this.arrayDeEstudantesSelecionados = this.arrayDeEstudantes.map((valor) => {
        return valor;
      });
      Array.from(checkEstudantes).forEach(estudante => {
        (<HTMLInputElement>estudante).checked = true;
      });
    } else {
      this.arrayDeEstudantesSelecionados = [];
      Array.from(checkEstudantes).forEach(estudante => {
        (<HTMLInputElement>estudante).checked = false;
      });
    }
  }

  public listarEstudantesTurmaSelecionada(event: Event): void {
    const trmIdSelecionada = parseInt((<HTMLInputElement>event.target).value, 10);
    const adicionarEstudantes = (<HTMLInputElement>event.target).checked;
    if (adicionarEstudantes) {
      this.feedbackUsuario = 'Adicionando estudantes...';
      this.estudanteService.listarTurmaId(trmIdSelecionada).toPromise().then((response: Response) => {
        Object.values(response).forEach((valor) => {
          this.arrayDeEstudantes.push(valor);
        });
        this.feedbackUsuario = undefined;
      }).catch((erro: Response) => {
        this.tratarErro(erro);
      });
    } else {
      this.arrayDeEstudantes = this.arrayDeEstudantes.filter((valor) => {
        return valor['trm_id'] != trmIdSelecionada;
      });
    }
  }

  public adicionarEstudantes(event: Event): void {
    const estIdSelecionado = parseInt((<HTMLInputElement>event.target).value, 10);
    const selecionarEstudantes = (<HTMLInputElement>event.target).checked;
    if (selecionarEstudantes) {
      this.arrayDeEstudantes.forEach((estudante) => {
        if (estudante['id'] == estIdSelecionado) {
          this.arrayDeEstudantesSelecionados.push(estudante);
        }
      });
    } else {
      this.arrayDeEstudantesSelecionados = this.arrayDeEstudantesSelecionados.filter((estudante) => {
        return estudante['id'] != estIdSelecionado ? estudante : null;
      });
    }
  }

  public pegarNomeProfessor(): void {
    this.arrayDeProfessorDisciplina.forEach((valor) => {
      const prdId = parseInt(valor['prd_id'], 10);
      if (prdId == this.prdId, 10) {
        this.nomeProfessor = valor['professor'];
        this.nomeDisciplina = valor['disciplina'];
      }
    });
  }


  public enviarAtividade(): void {
    const atividadeExtraClasse = new AtividadeExtraClasse();
    atividadeExtraClasse.aec_data_entrega = this.dataEntrega;
    atividadeExtraClasse.aec_data_envio = Utils.dataAtual();
    atividadeExtraClasse.aec_descricao = this.instrucoesAtividade;
    atividadeExtraClasse.aec_titulo = this.tituloAtividade;
    atividadeExtraClasse.prd_id = this.prdId;
    atividadeExtraClasse.usr_id = this.usrId;
    atividadeExtraClasse.remetende = this.remetenteAtividade;
    atividadeExtraClasse.professor = this.nomeProfessor;
    atividadeExtraClasse.disciplina = this.nomeDisciplina;
    atividadeExtraClasse.hora = Utils.horaAtual();
    this.feedbackUsuario = 'Gravando atividade, aguarde...';
    this.gravarAtividadesFirestore(atividadeExtraClasse).then((messageFirebase: MessageFirebase[]) => {
      this.feedbackUsuario = 'Enviando notificações, aguarde...';
      this.enviarNotificacaoPush(messageFirebase).then(() => {
        this.feedbackUsuario = undefined;
      }).catch((erro: Response) => {
        this.tratarErro(erro);
      });
    });


    /* this.atividadeExtraClasseService.inserirAtividadeExtraClasse(atividadeExtraClasse)
      .toPromise()
      .then((response: Response) => {
        const aecId = Object.values(response)[0]['aec_id'];
        this.feedbackUsuario = undefined;

      }).catch((erro: Response) => {
        this.tratarErro(erro);
      }); */
    /*
     console.log(this.tituloAtividade);
     console.log(this.instrucoesAtividade);
     console.log(this.arrayDeEstudantesSelecionados);
     console.log(this.arrayDeDadosDosAnexos);
     */
    /* this.feedbackUsuario = undefined; */
  }

  public enviarNotificacaoPush(messageFirebase: MessageFirebase[]): Promise<any> {
    return new Promise((resolve, reject) => {
      let pushesEnviados = 0;
      messageFirebase.forEach((message: MessageFirebase) => {
        this.firebaseService.enviarPushFirebase(message.to, message.titulo).toPromise().then(() => {
          pushesEnviados++;
          this.feedbackUsuario = `Enviada(s) ${pushesEnviados} de ${messageFirebase.length} notificações, aguarde...`;
          if (pushesEnviados == messageFirebase.length) {
            resolve('ok');
          }
        }).catch((erro: Response) => {
          this.tratarErro(erro);
          reject(erro);
        });
      });
    });
  }

  public gravarAtividadesFirestore(atividadeExtraClasse: AtividadeExtraClasse): Promise<MessageFirebase[]> {
    return new Promise((resolve, reject) => {
      const arrayDeMensagensFirebase = new Array<MessageFirebase>();
      this.arrayDeEstudantesSelecionados.forEach((estudanteSelecionado) => {
        const messageFirebase = new MessageFirebase();
        messageFirebase.cod_inep = this.inep;
        messageFirebase.data = atividadeExtraClasse.aec_data_envio;
        messageFirebase.data_versao = '';
        messageFirebase.est_id = '' + estudanteSelecionado['id'] + '';
        messageFirebase.firebase_dbkey = '';
        messageFirebase.hora = Utils.horaAtual();
        messageFirebase.msg = 'Atividade extra classe';
        messageFirebase.msg_tag = 'Atividade';
        messageFirebase.nome_estudante = estudanteSelecionado['nome'];
        messageFirebase.tipo_msg = 'Atividade';
        messageFirebase.titulo = 'Atividade extra classe';
        messageFirebase.to = `${this.inep}_${messageFirebase.est_id}`;
        this.firebaseService.gravarAtividadeExtraClasseFirebaseFirestore(messageFirebase,
          this.arrayDeDadosDosAnexos, atividadeExtraClasse)
          .then((response: Response) => {
            messageFirebase.firebase_dbkey = response['id'];
            arrayDeMensagensFirebase.push(messageFirebase);
            this.feedbackUsuario = `Gravando ${arrayDeMensagensFirebase.length} de
            ${this.arrayDeEstudantesSelecionados.length}...`;
            if (arrayDeMensagensFirebase.length == this.arrayDeEstudantesSelecionados.length) {
              resolve(arrayDeMensagensFirebase);
            }
          }).catch((erro: Response) => {
            this.tratarErro(erro);
            reject(erro);
          });
      });
    });
  }

  public excluirArquivoAnexado(nomeArquivo: string): void {
    this.arrayDeDadosDosAnexos = this.arrayDeDadosDosAnexos.filter(anexo => {
      return anexo['nome'] != nomeArquivo;
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
          }
        }).catch((erro: Response) => {
          this.tratarErro(erro);
        });
      }).catch((erro: Response) => {
        this.tratarErro(erro);
      });
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
