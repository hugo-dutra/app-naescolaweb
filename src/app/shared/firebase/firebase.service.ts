import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MessageFirebase } from '../firebase/message.model';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { FirebaseUpload } from './firebase.upload.model';
// import { Portaria } from "src/app/crud/portaria/portaria.model";
// import { CronogramaPortaria } from "src/app/crud/portaria/cronograma-portaria.model";
import { Utils } from '../utils.shared';
import { CONSTANTES } from '../constantes.shared';
import { RequestOptions } from 'http';
import { Portaria } from '../../crud/portaria/portaria.model';
import { CronogramaPortaria } from '../../crud/portaria/cronograma-portaria.model';
import { PortariaFirebase } from '../../crud/portaria/portaria.firebase.model';
import { reject } from 'q';
import { AtividadeExtraClasse } from '../../crud/atividade-extra-classe/atividade-extra-classe.model';

@Injectable()
export class FirebaseService {
  private firestore = firebase.firestore();
  private auth = firebase.auth();
  // private sett = { timestampsInSnapshots: true };
  constructor(private http: HttpClient) {
    // this.firestore.settings(this.sett);
  }

  // ****************************************************************************/
  // ******************************PUSH******************************************/
  public enviarPushFirebase(topico: string, titulo: string): Observable<any> {
    try {
      const headers = {
        headers: new HttpHeaders()
          .append('Content-type', 'application/json')
          .append('Authorization',
            // tslint:disable-next-line: max-line-length
            'Key=AAAAH0kr4hA:APA91bGlwDwDSBHclBxLBA74s-GT3otyDdmmmGJpNgoxISElSsrnMq1TevXDea5hBrWRpRsK8JDFsB5Af10wWrkstMkCAqGh-tjGseeZcUjPSJU62JtyD9xNDtC52NzsClr-L5SkmFKE'),
      };

      const message = {
        to: '/topics/' + topico,
        notification: {
          title: 'NaEscola',
          body: titulo,
        },
        TimeToLive: 2400000,
      };
      return this.http.post('https://fcm.googleapis.com/fcm/send', message, headers);
    } catch (error) {

    }

  }


  // ****************************************************************************/
  // ***************************STORAGE******************************************/
  public enviarArquivoFirebase(firebaseUpload: FirebaseUpload, basePath: string): Promise<any> {
    const storageRef = firebase.storage().ref();
    return storageRef.child(`${basePath}/${firebaseUpload.name}`).put(firebaseUpload.file).then((retorno) => {
      // alert(retorno)
    });
  }

  public enviarArquivoFirebaseComProgresso(firebaseUpload: FirebaseUpload,
    basePath: string): firebase.storage.UploadTask {
    const storageRef = firebase.storage().ref();
    return storageRef.child(`${basePath}/${firebaseUpload.name}`).put(firebaseUpload.file);
  }

  public pegarUrlArquivoUpload(firebaseUpload: FirebaseUpload, basePath: string): Promise<any> {
    const storageRef = firebase.storage().ref();
    return storageRef.child(`${basePath}/${firebaseUpload.name}`).getDownloadURL();
  }
  // *****************************************************************************/
  // ***************************FIRESTORE*****************************************/

  /* public escreverDocumentosTeste(inep: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firestore
        .collection('naescolaApp')
        .doc(inep)
        .collection('testeEscrita').add({
          status: 0,
          sincronizado: false,
          data: (new Date()),
          dados: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
        }).then((documentReference: firebase.firestore.DocumentReference) => {
          resolve(documentReference);
        }).catch((reason: any) => {
          reject(reason);
        });
    });
  } */

  /* public atualizarStatusDocumentos_0_1(inep: string): Promise<firebase.firestore.QuerySnapshot> {
    return new Promise((resolve, reject) => {
      this.firestore.collection('naescolaApp').doc(inep).collection('testeEscrita').where('status', '==', 0).onSnapshot((docs: firebase.firestore.QuerySnapshot) => {
        resolve(docs);
      });
       var batch = this.firestore.batch();
      batch.update(docRef, 'status', 1)
    });
  } */

  public listarPortariaControleRemoto(inep: string): Promise<any> {
    // tslint:disable-next-line: no-shadowed-variable
    return new Promise((resolve, reject) => {
      this.firestore
        .collection('naescolaApp')
        .doc(inep)
        .collection('portarias')
        .get()
        .then((querySnapshot: firebase.firestore.QuerySnapshot) => {
          resolve(querySnapshot);
        }).catch((reason: any) => {
          reject(reason);
        });
    });
  }

  public criarConfiguracaoNovaPortariaApp(inep: string, codigoPortaria: string, nomePortaria: string): void {
    this.firestore
      .collection('naescolaApp')
      .doc(inep)
      .collection('portarias')
      .doc(codigoPortaria)
      .set({
        ajuste_hora: 0,
        atraso: true,
        atualizar_estudante: true,
        atualizar_foto: true,
        controle_saida: true,
        modo: 'entrada',
        nome: nomePortaria,
        sem_uniforme: false,
      });
  }

  public alterarConfiguracaoPortariaFirestoreApp(inep: string, codigoPortaria: string, nomePortaria: string): void {
    this.firestore
      .collection('naescolaApp')
      .doc(inep)
      .collection('portarias')
      .doc(codigoPortaria)
      .set({
        ajuste_hora: 0,
        atraso: true,
        atualizar_estudante: true,
        atualizar_foto: true,
        controle_saida: true,
        modo: 'entrada',
        nome: nomePortaria,
        sem_uniforme: false,
      });
  }

  public excluirConfiguracaoPortariaApp(inep: string, codigoPortaria: string): void {
    this.firestore
      .collection('naescolaApp')
      .doc(inep)
      .collection('portarias')
      .doc(codigoPortaria)
      .delete();
  }

  public gravarModoPortaria(inep: string, codigoPortaria: string, valor: string): void {
    this.firestore.collection('naescolaApp').doc(inep)
      .collection('portarias').doc(codigoPortaria).update({ modo: valor });
  }

  public gravarModoRegistroOcorrenciaAtrasoPortaria(inep: string, codigoPortaria: string, valor: boolean): void {
    this.firestore.collection('naescolaApp').doc(inep)
      .collection('portarias').doc(codigoPortaria).update({ atraso: valor });
  }

  public gravarModoRegistroOcorrenciaSemUniformePortaria(inep: string, codigoPortaria: string, valor: boolean): void {
    this.firestore.collection('naescolaApp').doc(inep)
      .collection('portarias').doc(codigoPortaria).update({ sem_uniforme: valor });
  }

  public gravarModoControlarSaidaPortaria(inep: string, codigoPortaria: string, valor: boolean): void {
    this.firestore.collection('naescolaApp').doc(inep)
      .collection('portarias').doc(codigoPortaria).update({ controle_saida: valor });
  }

  public gravarAjusteHoraPortaria(inep: string, codigoPortaria: string, valor: number): void {
    this.firestore.collection('naescolaApp').doc(inep)
      .collection('portarias').doc(codigoPortaria).update({ ajuste_hora: valor });
  }


  public gravarSugestaoInformacaoBug = async (rota: string, detalhesInformacao: Object) => {
    const dataInformacao = Utils.dataAtual();
    const horaInformacao = Utils.horaAtual();

    // **************DADOS ESCOLA**************/
    const dadosEscola = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados_escola'), CONSTANTES.PASSO_CRIPT))[0];
    const inep = dadosEscola['inep'];
    const esc_id = dadosEscola['id'];
    const nome_escola = dadosEscola['nome'];
    const rede_ensino = dadosEscola['rede_ensino'];
    // **************DADOS USUÁRIO**************/
    const dadosUsuario = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados'), CONSTANTES.PASSO_CRIPT))[0];
    const usr_id = dadosUsuario['id'];
    const nome_usuario = dadosUsuario['nome'];

    return new Promise(resolve => {
      this.firestore
        .collection('sugestoesErrosBugsNaEscolaWeb')
        .doc(rede_ensino)
        .collection('escolas')
        .doc(inep)
        .collection('informacoes')
        .add({
          data: dataInformacao,
          hora: horaInformacao,
          esc_id: esc_id,
          escola: nome_escola,
          usr_id: usr_id,
          nome_usuario: nome_usuario,
          rota: rota,
          detalhesInformacao: detalhesInformacao,
        }).then((retorno) => {
          resolve(retorno);
        }).catch((error: Response) => {
          resolve(error);
        });
    });
  }

  /**
   * Lista os documentos para determinada coleção
   * @param colecao Coleção de documentos
   * @param est_id Matrícula do estudante
   * @param inep Código ine da escola
   */
  public listarStatusEntregaMensagensColecao(colecao: string, est_id: string, inep: string): Promise<any> {
    // tslint:disable-next-line: no-shadowed-variable
    return new Promise((resolve, reject) => {
      this.firestore
        .collection('naescolaApp')
        .doc(inep)
        .collection('matriculados')
        .doc(est_id)
        .collection(colecao)
        .where('leitura', '>=', 1)
        .get()
        .then((response: firebase.firestore.QuerySnapshot) => {
          resolve(response);
        }).catch((reason: any) => {
          reject(reason);
        });
    });
  }

  /**
   *  Grava, na portaria, toda a listagem dos estudantes da escola num único documento.
   * @memberof FirebaseService
   */
  public gravarListagemEstudantesPortariaDocumentoUnico = (
    estudantes: Object[], codigoPortaria: string, parteArray: number): Promise<any> => {
    // **************DADOS ESCOLA**************/
    // tslint:disable-next-line: no-shadowed-variable
    return new Promise((resolve, reject) => {
      this.firestore
        .collection('portariaWeb')
        .doc(codigoPortaria)
        .collection('listagem_carga_estudantes')
        .doc(parteArray.toString())
        .set({ estudantes: estudantes }).then(() => {
          resolve({ retorno: 'ok' });
        }).catch((reason: any) => {
          reject({ retorno: reason });
        });
    });
  }

  /**
   * Procedure Grava us usuários autorizados a tirar fotografias.
   * @param usuarios
   */
  public gravarUsuariosAutorizadosTirarFotos(usuarios: Object[], inep: string): Promise<Object> {
    // tslint:disable-next-line: no-shadowed-variable
    return new Promise((resolve, reject) => {
      let contaUsuariosCadastrados: number = 0;
      const totalUsuariosCadastrados: number = usuarios.length;
      usuarios.forEach(usuario => {
        const usr_id: number = usuario['usr_id'];
        this.firestore
          .collection('naescolaApp')
          .doc(inep)
          .collection('permissoes')
          .doc(usr_id.toString()).set({ fotos: true }).then(() => {
          }).catch(() => {
            reject('Erro ao gravar autorizações');
          });
        contaUsuariosCadastrados++;
        if (contaUsuariosCadastrados == totalUsuariosCadastrados) {
          resolve('usuarios cadastrados');
        }
      });
    });
  }

  public revogarUsuariosTirarFotos(usuarios: Object[], inep: string): Promise<Object> {
    // tslint:disable-next-line: no-shadowed-variable
    return new Promise((resolve, reject) => {
      let contaUsuariosCadastrados: number = 0;
      const totalUsuariosCadastrados: number = usuarios.length;
      usuarios.forEach(usuario => {
        const usr_id: number = usuario['usr_id'];
        this.firestore
          .collection('naescolaApp')
          .doc(inep)
          .collection('permissoes')
          .doc(usr_id.toString()).set({ fotos: false }).then(() => {
          }).catch(() => {
            reject('Erro ao gravar autorizações');
          });
        contaUsuariosCadastrados++;
        if (contaUsuariosCadastrados == totalUsuariosCadastrados) {
          resolve('usuarios cadastrados');
        }
      });
    });
  }

  public revogarUsuarioIndividual(inep: string, usr_id: string): Promise<Object> {
    // tslint:disable-next-line: no-shadowed-variable
    return new Promise((resolve, reject) => {
      this.firestore
        .collection('naescolaApp')
        .doc(inep)
        .collection('permissoes')
        .doc(usr_id.toString()).set({ fotos: false }).then(() => {
          resolve('usuarios cadastrados');
        }).catch(() => {
          reject('Erro ao gravar autorizações');
        });
    });
  }

  public concederUsuarioIndividual(inep: string, usr_id: string): Promise<Object> {
    // tslint:disable-next-line: no-shadowed-variable
    return new Promise((resolve, reject) => {
      this.firestore
        .collection('naescolaApp')
        .doc(inep)
        .collection('permissoes')
        .doc(usr_id.toString()).set({ fotos: true }).then(() => {
          resolve('usuarios cadastrados');
        }).catch(() => {
          reject('Erro ao gravar autorizações');
        });
    });
  }

  /**
   * Grava, no aplicativo, toda a listagem dos estudantes da escola num único documento.
   * @memberof FirebaseService
   */
  public gravarListagemEstudantesAplicativoDocumentoUnico = (
    estudantes: Object[], parteArray: number): Promise<any> => {
    // **************DADOS ESCOLA**************/
    const dadosEscola = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados_escola'), CONSTANTES.PASSO_CRIPT))[0];
    const inep = dadosEscola['inep'];
    // tslint:disable-next-line: no-shadowed-variable
    return new Promise((resolve, reject) => {
      this.firestore
        .collection('naescolaApp')
        .doc(inep)
        .collection('listagens')
        .doc('modoAdmin')
        .collection('estudantes')
        .doc(parteArray.toString()).set({ estudantes }).then(() => {
          resolve({ retorno: 'ok' });
        }).catch((reason: any) => {
          reject({ retorno: reason });
        });
    });
  }

  public gravarTiposOcorrenciasAplicativoAdministravivo(tiposOcorrencias: Object, inep: string): Promise<any> {
    // tslint:disable-next-line: no-shadowed-variable
    return new Promise((resolve, reject) => {
      this.firestore.collection('naescolaApp')
        .doc(inep)
        .collection('listagens')
        .doc('modoAdmin')
        .collection('tiposOcorrencias')
        .doc('0').set({ tiposOcorrencias: tiposOcorrencias }).then((response: any) => {
          resolve('ok');
        }).catch((reason: any) => {
          reject(reason);
        });
    });
  }

  public listarOcorrenciasDisciplinaresAplicativoAdministravivo(
    inep: string): Promise<firebase.firestore.QuerySnapshot> {
    // tslint:disable-next-line: no-shadowed-variable
    return new Promise((resolve, reject) => {
      this.firestore.collection('naescolaApp')
        .doc(inep)
        .collection('sincronizarOcorrencias')
        .where('sincronizada', '==', false).where('registrarEntradaManual', '==', false)
        .get()
        .then((retorno: firebase.firestore.QuerySnapshot) => {
          resolve(retorno);
        }).catch((reason: any) => {
          reject(reason);
        });
    });
  }

  public listarEntradasManuaisAplicativoAdministravivo(inep: string): Promise<firebase.firestore.QuerySnapshot> {
    // tslint:disable-next-line: no-shadowed-variable
    return new Promise((resolve, reject) => {
      this.firestore.collection('naescolaApp')
        .doc(inep)
        .collection('sincronizarOcorrencias')
        .where('sincronizada', '==', false).where('registrarEntradaManual', '==', true)
        .get()
        .then((retorno: firebase.firestore.QuerySnapshot) => {
          resolve(retorno);
        }).catch((reason: any) => {
          reject(reason);
        });
    });
  }

  public atualizarStatusOcorrenciasDepoisDeSincronizar(
    inep: string, documentosParaAtualizar: firebase.firestore.QuerySnapshot): Promise<string> {
    return new Promise((resolve) => {
      const documentos = documentosParaAtualizar.docs;
      documentos.forEach((documento: firebase.firestore.QueryDocumentSnapshot) => {
        const status = true;
        const id = documento.id;
        const dados = documento.data();
        if (dados['registrarEntradaManual'] == false) {
          this.firestore.collection('naescolaApp')
            .doc(inep)
            .collection('sincronizarOcorrencias').doc(id).update({ sincronizada: status });
        }
      });
      resolve('ok');
    });
  }

  public atualizarStatusEntradasManuaisDepoisDeSincronizar(
    inep: string, documentosParaAtualizar: firebase.firestore.QuerySnapshot): Promise<string> {
    return new Promise((resolve) => {
      const documentos = documentosParaAtualizar.docs;
      documentos.forEach((documento: firebase.firestore.QueryDocumentSnapshot) => {
        const status = true;
        const id = documento.id;
        const dados = documento.data();
        if (dados['registrarEntradaManual'] == true) {
          this.firestore.collection('naescolaApp')
            .doc(inep)
            .collection('sincronizarOcorrencias').doc(id).update({ sincronizada: status });
        }
      });
      resolve('ok');
    });
  }

  public gravarListagemEstudantesAplicativoAdministrativoBatch(estudantes: Object[]): Promise<any> {
    const dadosEscola = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados_escola'), CONSTANTES.PASSO_CRIPT))[0];
    const inepEscola = dadosEscola['inep'];
    // tslint:disable-next-line: no-shadowed-variable
    return new Promise((resolve, reject) => {
      const batch = this.firestore.batch();
      estudantes.forEach((estudante: Object) => {
        const escola = estudante['escola'];
        const etapa = estudante['etapa'];
        const foto = estudante['foto'];
        const inep = estudante['inep'];
        const est_id: string = estudante['est_id'].toString();
        const nome = estudante['nome'];
        const serie = estudante['serie'];
        const telefoneEscola = estudante['telefoneEscola'];
        const turma = estudante['turma'];
        const turno = estudante['turno'];
        const referenciaEstudante = this.firestore.collection('naescolaApp').doc(inepEscola)
          .collection('matriculados').doc(est_id);
        batch.set(referenciaEstudante, {
          escola, etapa, foto, inep, est_id, nome, serie,
          telefoneEscola, turma, turno,
        });
      });
      batch.commit().then(() => {
        resolve('ok');
      }).catch((reason: any) => {
        reject(reason);
      });
    });
  }

  public gravarListagemEstudanteAplicativoAdministrativo = (estudante: Object): Promise<any> => {
    const dadosEscola = JSON.parse(Utils.decriptAtoB(
      localStorage.getItem('dados_escola'), CONSTANTES.PASSO_CRIPT))[0];
    const inep = dadosEscola['inep'];
    return new Promise((resolve) => {
      this.firestore
        .collection('naescolaApp')
        .doc(inep)
        .collection('matriculados')
        .doc(estudante['est_id'])
        .set({ estudante }).then(() => {
          resolve('ok');
        });
    });
  }


  public gravarLogErro = async (localErro, detalhesErro) => {
    const dataErro = Utils.dataAtual();
    const horaErro = Utils.horaAtual();

    // **************DADOS ESCOLA**************/
    const dadosEscola = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados_escola'), CONSTANTES.PASSO_CRIPT))[0];
    const inep = dadosEscola['inep'];
    const esc_id = dadosEscola['id'];
    const nome_escola = dadosEscola['nome'];
    const rede_ensino = dadosEscola['rede_ensino'];
    // **************DADOS USUÁRIO**************/
    const dadosUsuario = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados'), CONSTANTES.PASSO_CRIPT))[0];
    const usr_id = dadosUsuario['id'];
    const nome_usuario = dadosUsuario['nome'];

    return new Promise(resolve => {
      this.firestore
        .collection('logErrosNaEscolaWeb')
        .doc(rede_ensino)
        .collection('escolas')
        .doc(inep)
        .collection('erros')
        .add({
          data: dataErro,
          hora: horaErro,
          esc_id: esc_id,
          escola: nome_escola,
          usr_id: usr_id,
          nome_usuario: nome_usuario,
          local_erro: localErro,
          detalhe_erro: detalhesErro,
        }).then((retorno) => {
          resolve(retorno);
        }).catch((error: Response) => {
          resolve(error);
        });
    });
  }

  /**
   *Gravar ocorrência disciplinar
   *
   * @memberof FirebaseService
   */
  public gravarOcorrenciaDisciplinarFirebaseFirestore = async (messageFirebase: MessageFirebase) => {
    return new Promise(resolve => {
      this.firestore
        .collection('naescolaApp')
        .doc(messageFirebase.cod_inep)
        .collection('matriculados')
        .doc(messageFirebase.est_id.toString())
        .collection('ocorrencias')
        .add({
          data: messageFirebase.data, hora: messageFirebase.hora,
          categoria: messageFirebase.tipo_msg, leitura: 0,
        }).then((retorno) => {
          resolve(retorno);
        }).catch((error: Response) => {
          resolve(error);
        });
    });
  }

  /**
   *
   *
   * @memberof FirebaseService
   */
  public gravarEntradasManuaisFirebaseFirestore = async (messageFirebase: MessageFirebase) => {
    return new Promise(resolve => {
      this.firestore
        .collection('naescolaApp')
        .doc(messageFirebase.cod_inep)
        .collection('matriculados')
        .doc(messageFirebase.est_id.toString())
        .collection('entradas')
        .add({
          data: messageFirebase.data, hora: messageFirebase.hora,
          categoria: messageFirebase.tipo_msg, leitura: 0,
        }).then((retorno) => {
          resolve(retorno);
        }).catch((error: Response) => {
          resolve(error);
        });
    });
  }


  /**
   *Gravar comunicados da direção.
   *
   * @memberof FirebaseService
   */
  public gravarComunicadoDirecaoFirebaseFirestore = async (messageFirebase: MessageFirebase, anexos: Object[]) => {
    return new Promise(resolve => {
      this.firestore
        .collection('naescolaApp')
        .doc(messageFirebase.cod_inep)
        .collection('matriculados')
        .doc(messageFirebase.est_id)
        .collection('comunicados')
        .add({
          data: messageFirebase.data,
          hora: messageFirebase.hora,
          assunto: messageFirebase.titulo,
          msg: messageFirebase.msg,
          leitura: 0,
          anexos: anexos,
        }).then((retorno) => {
          resolve(retorno);
        }).catch((error: Response) => {
          resolve(error);
        });
    });
  }

  public gravarAtividadeExtraClasseFirebaseFirestore = async (
    messageFirebase: MessageFirebase,
    anexos: Object,
    atividadeExtraClasse: AtividadeExtraClasse) => {
    return new Promise(resolve => {
      this.firestore
        .collection('naescolaApp')
        .doc(messageFirebase.cod_inep)
        .collection('matriculados')
        .doc(messageFirebase.est_id)
        .collection('tarefas')
        .add({
          dataEntrega: atividadeExtraClasse.aec_data_entrega,
          data: atividadeExtraClasse.aec_data_envio,
          descricao: atividadeExtraClasse.aec_descricao,
          titulo: atividadeExtraClasse.aec_titulo,
          professor: atividadeExtraClasse.professor,
          disciplina: atividadeExtraClasse.disciplina,
          remetente: atividadeExtraClasse.remetende,
          hora: atividadeExtraClasse.hora,
          leitura: 0,
          anexos: anexos,
        }).then((retorno) => {
          resolve(retorno);
        }).catch((error: Response) => {
          resolve(error);
        });
    });
  }

  public gravarMensagemFirebaseFirestore(messageFirebase: MessageFirebase): void {
    this.firestore.collection(messageFirebase.cod_inep).doc(messageFirebase.est_id)
      // tslint:disable-next-line: no-shadowed-variable
      .collection('mensagens').add(messageFirebase).then((retorno) => {

      });
    const retorno = firebase.firestore().collection(messageFirebase.cod_inep).onSnapshot(() => {
    });
    retorno();
  }

  public lerFotosEstudanteAplicativoAdministrativo = async (inep: string) => new Promise((resolve) => {
    return this.firestore
      .collection('naescolaApp')
      .doc(inep)
      .collection('matriculados')
      .where('foto.url', '>', '')
      .get()
      .then((querySnapshot: firebase.firestore.QuerySnapshot) => {
        resolve(querySnapshot);
      });
  })

  public lerDadosFrequenciaEntradaPortaria = async (
    codigoPortaria: string, ultimoRegistro: string) => new Promise((resolve) => {
      return this.firestore
        .collection('portariaWeb')
        .doc(codigoPortaria)
        .collection('passagens')
        .doc('entradas')
        .collection('registros').where('data', '>=', ultimoRegistro)
        .get()
        .then((querySnapshot: firebase.firestore.QuerySnapshot) => {
          resolve(querySnapshot);
        });
    })

  public lerDadosFrequenciaSaidaPortaria = async (
    codigoPortaria: string, ultimoRegistro: string) => new Promise((resolve) => {
      return this.firestore
        .collection('portariaWeb')
        .doc(codigoPortaria)
        .collection('passagens')
        .doc('saidas')
        .collection('registros').where('data', '>=', ultimoRegistro).get()
        .then((querySnapshot: firebase.firestore.QuerySnapshot) => {
          resolve(querySnapshot);
        });
    })

  public lerDadosAtrasoPortaria = async (codigoPortaria: string) => new Promise((resolve) => {
    return this.firestore
      .collection('portariaWeb')
      .doc(codigoPortaria)
      .collection('ocorrencias').doc('atraso').collection('registros').get()
      .then((querySnapshot: firebase.firestore.QuerySnapshot) => {
        resolve(querySnapshot);
      });
  })

  public lerDadosSemUniformePortaria = async (codigoPortaria: string) => new Promise((resolve) => {
    return this.firestore
      .collection('portariaWeb')
      .doc(codigoPortaria)
      .collection('ocorrencias')
      .doc('sem uniforme')
      .collection('registros').get().then((querySnapshot: firebase.firestore.QuerySnapshot) => {
        resolve(querySnapshot);
      });
  })

  /**
   * Grava estudantes para serem carregados pelo aplicativo dos pais
   * @param inep
   * @param est_id
   * @param foto
   * @param nome
   * @param serie
   * @param turma
   * @param turno
   */
  public gravarEstudanteFirebaseFirestoreAplicativo(inep: string, est_id: string,
    foto: string, nome: string, serie: string, turma: string, turno: string, etapa: string): Promise<any> {

    return this.firestore
      .collection('naescolaApp')
      .doc(inep)
      .collection('matriculados')
      .doc(est_id)
      .set({ foto, nome, serie, turma, turno, etapa });
  }

  /**
   *  Grava configurações da portaria no servidor do FireBase
   * @param portaria
   */
  public gravarConfiguracaoFirebaseFirestorePortaria = async (
    // tslint:disable-next-line: no-shadowed-variable
    portaria: PortariaFirebase) => new Promise((resolve, reject) => {
      this.firestore
        .collection('portariaWeb')
        .doc(portaria.codigo)
        .collection('parametros')
        .doc('configuracao')
        .set({
          codigo: portaria['codigo'], esc_id: portaria['esc_id'],
          nome: portaria['nome'], por_id: portaria['por_id'], turnos: portaria['turnos'],
        }).then(() => {
          resolve('sucesso');
        });
    })

  /**
   * Grava dados do cronograma da portaria
   *
   * @memberof FirebaseService
   */
  public gravarCronogramaFirebaseFirestorePortaria = async (
    cronogramaPortaria: CronogramaPortaria) => new Promise((resolve) => {
      this.firestore
        .collection('portariaWeb')
        .doc(cronogramaPortaria.codigoPortaria)
        .collection('cronogramas').doc(cronogramaPortaria.crpId.toString()).set({
          horarioInicio: cronogramaPortaria.horarioInicio,
          horarioFim: cronogramaPortaria.horarioFim,
          modoPortaria: cronogramaPortaria.modoPortaria,
        })
        .then(() => { resolve('sucesso'); });
    })

  /**
   *Exclui cronograma INDIVIDUAL de acordo com o crp_id
   * @param cronogramaPortaria
   * @memberof FirebaseService
   */
  public apagarCronogramaFirebaseFirestorePortaria = async (
    cronogramaPortaria: CronogramaPortaria) => new Promise((resolve) => {
      this.firestore.collection('portariaWeb').doc(
        cronogramaPortaria['codigo_portaria']).collection('cronogramas')
        .doc(cronogramaPortaria['crp_id'].toString()).delete().then(() => {
          resolve('sucesso');
        });
    })

  /**
   *Exclui matriculado INDIVIDUAL de acordo com a matricula
   * @param codigo_portaria
   * @param est_id
   * @memberof FirebaseService
   */
  public apagarMatriculadoFirebaseFirestorePortaria = async (
    codigo_portaria: string, est_id: string) => new Promise((resolve) => {
      this.firestore.collection('portariaWeb').doc(codigo_portaria)
        .collection('matriculados').doc(est_id).delete().then(() => {
          resolve('sucesso');
        });
    })

  /**
   * Exclui configurações ÚNICAS de acordo com o código da portaria
   * @param codigo_portaria
   * @memberof FirebaseService
   */
  public apagarConfiguracaoFirebaseFirestorePortaria = async (codigo_portaria: string) => new Promise((resolve) => {
    this.firestore.collection('portariaWeb').doc(codigo_portaria)
      .collection('parametros').doc('configuracao').delete().then(() => {
        resolve('sucesso');
      });
  })

  /**
   * Alterar as configurações ÚNICAS da portaria de acordo com o código da portaria.
   *
   * @memberof FirebaseService
   */
  public alterarConfiguracaoFirebaseFirestorePortaria = async (portaria: PortariaFirebase) => new Promise((resolve) => {
    this.firestore
      .collection('portariaWeb')
      .doc(portaria.codigo)
      .collection('parametros')
      .doc('configuracao')
      .set({
        codigo: portaria['codigo'], esc_id: portaria['esc_id'],
        nome: portaria['nome'], por_id: portaria['por_id'], turnos: portaria['turnos'],
      }).then(() => {
        resolve('sucesso');
      });
  })

  public inserirConfiguracaoFirebaseFirestorePortaria = async (portaria: PortariaFirebase) => new Promise((resolve) => {
    this.firestore
      .collection('portariaWeb')
      .doc(portaria.codigo)
      .collection('parametros')
      .doc('configuracao')
      .set({
        codigo: portaria['codigo'], esc_id: portaria['esc_id'],
        nome: portaria['nome'], por_id: portaria['por_id'], turnos: portaria['turnos'],
      }).then(() => {
        resolve('sucesso');
      });
  })

  /**
   * Apaga registro de saída antecipada eventual na portaria
   *
   * @memberof FirebaseService
   */
  public apagarSaidaAntecipadaEventual = async (codigo_portaria: string, est_id: string) => new Promise((resolve) => {
    this.firestore.collection('portariaWeb').doc(codigo_portaria)
      .collection('saida_antecipada_eventual').doc(est_id).delete().then(() => {
        resolve('sucesso');
      });
  })


  /**
   * Apaga conjunto de estudantes matriculados cadastrados na portaria
   * @param codigo_portaria
   * @memberof FirebaseService
   */
  public apagarMatriculadosFirebaseFirestorePortaria = async (codigo_portaria: string) => new Promise((resolve) => {
    this.firestore.collection('portariaWeb').doc(codigo_portaria)
      .collection('matriculados')
      .get().then((retorno) => {
        const matriculados = retorno.docs;
        let contaExcluiMatriculados = 0;
        if (matriculados.length > 0) {
          matriculados.forEach((matriculado) => {
            const est_id = matriculado.id;
            this.apagarMatriculadoFirebaseFirestorePortaria(codigo_portaria, est_id).then(() => {
              contaExcluiMatriculados += 1;
              if (contaExcluiMatriculados == matriculados.length) {
                resolve('ok');
              }
            });
          });
        } else {
          resolve('ok');
        }
      });
  })

  /**
   * Apaga conjunto de cronogramas cadastrados na portaria
   * @param codigo_portaria
   * @memberof FirebaseService
   */
  public apagarCronogramasFirebaseFirestorePortaria = async (codigo_portaria: string) => new Promise((resolve) => {
    this.firestore.collection('portariaWeb').doc(codigo_portaria).collection('cronogramas').get().then((retorno) => {
      const cronogramas = retorno.docs;
      let contaExcluiCronogramas = 0;
      if (cronogramas.length > 0) {
        cronogramas.forEach((cronograma) => {
          const cronogramaPortaria = new CronogramaPortaria();
          cronogramaPortaria['codigo_portaria'] = codigo_portaria;
          cronogramaPortaria['crp_id'] = parseInt(cronograma.id, 10);
          this.apagarCronogramaFirebaseFirestorePortaria(cronogramaPortaria).then(() => {
            contaExcluiCronogramas += 1;
            if (contaExcluiCronogramas == cronogramas.length) {
              resolve('ok');
            }
          });
        });
      } else {
        resolve('ok');
      }
    });
  })

  /**
  * Apaga, em cascata, os dados da portaria. Primeiro as configurações.
  * Depois, os cronogramas, e por fim os estudantes matriculados.
  * @param codigoPortaria
  * @memberof FirebaseService
  */
  public apagarPortariaFirebaseServicePortaria = async (codigo_portaria: string) => new Promise((resolve) => {
    this.apagarConfiguracaoFirebaseFirestorePortaria(codigo_portaria).then(() => {
      this.apagarCronogramasFirebaseFirestorePortaria(codigo_portaria).then(() => {
        this.apagarMatriculadosFirebaseFirestorePortaria(codigo_portaria).then(() => {
          resolve('ok');
        });
      });
    }).catch(() => {
      resolve('ok');
    });
  })

  /**
   *  Grava lista de estudantes para serem usados no aplicativo
   * @param codigoPortaria
   * @param est_id
   * @param foto
   * @param nome
   * @param serie
   * @param turma
   * @param turno
   * @param etapa
   */
  public gravarEstudanteFirebaseFirestorePortaria(codigoPortaria: string, est_id: string,
    foto: string, nome: string, serie: string, turma: string, turno: string, etapa: string): Promise<any> {
    return new Promise((resolve) => {
      this.firestore
        .collection('portariaWeb')
        .doc(codigoPortaria)
        .collection('matriculados')
        .doc(est_id)
        .set({ foto, nome, serie, turma, turno, etapa })
        .then(() => {
          resolve('ok');
        });
    });
  }

  /**
   * Gravar autorização de saída antecipada eventual nas portarias.
   * @param codigoPortaria
   * @param matricula
   * @param data
   * @param hora
   */
  public gravarSaidaAntecipadaEventual(codigoPortaria: string, est_id: string,
    data: string, hora: string): Promise<any> {
    return new Promise((resolve) => {
      this.firestore
        .collection('portariaWeb')
        .doc(codigoPortaria)
        .collection('saida_antecipada_eventual')
        .doc(est_id)
        .set({ data, hora }).then(() => {
          resolve('ok');
        });
    });
  }

  // **********************************************************************************/
  // ***************************FIREBASE AUTH*****************************************/
  public logarAnonimamente(): Promise<string> {
    // tslint:disable-next-line: no-shadowed-variable
    return new Promise((resolve, reject) => {
      this.auth.signInAnonymously().then((credencial: firebase.auth.UserCredential) => {
        resolve(credencial.user.uid);
      }).catch((erro: any) => {
        reject(erro);
      });
    });
  }

  // **********************************************************************************/
  // ***************************CLOUD FUNCTION*****************************************/
  public carregarEstudantesPortariaFirebaseFirestore = async (
    estudantes: Object[], codigoPortaria: string) => new Promise((resolve) => {
      const carregarEstudantesPortaria = firebase.functions().httpsCallable('carregarEstudantesPortaria');
      carregarEstudantesPortaria({ estudantes: estudantes, codigoPortaria: codigoPortaria }).then(retorno => {
        resolve(retorno);
      });
    })

  public criarUsuarioAnonimoFirestore = async (uid: string, nome: string,
    escola: string, inep: string, usr_id: string) => new Promise((resolve) => {
      const user = { nome: nome, colegio: escola, inep: inep, codigo: usr_id };
      const criarUsuarioAnonimo = firebase.functions().httpsCallable('supervisorEscolar_GravarUsuarioAdmin');
      criarUsuarioAnonimo({
        user: user,
        uid: uid,
      }).then(retorno => {
        resolve(retorno);
      });
    })

  public pegarTokenIntegracaoIeducar = async () => new Promise((resolve) => {
    const tokenIntegracao = firebase.functions().httpsCallable('pegarTokenIntegracaoIeducarV5');
    tokenIntegracao().then(retorno => {
      resolve(retorno);
    });
  })

  public carregarEstudantesAplicativoFirebaseFirestore = async (
    estudantes: Object[], inep: string) => new Promise((resolve) => {
      const carregarEstudantesPortaria = firebase.functions().httpsCallable('carregarEstudantesAplicativo');
      carregarEstudantesPortaria({ estudantes: estudantes, inep: inep }).then(retorno => {
        resolve(retorno);
      });
    })

  /**
   * Grava saídas antecipadas eventuais de uma vez só.
   *
   * @memberof FirebaseService
   */
  public gravarSaidaAntecipadaEventualFirebaseFirestore = async (
    portarias: string[], est_ids: string[], dataSaida: string, horaSaida: string) => new Promise((resolve) => {
      const gravarSaidaAntecipadaEventual = firebase.functions().httpsCallable('gravarSaidaAntecipadaEventual');
      gravarSaidaAntecipadaEventual({
        portarias: portarias, est_ids: est_ids,
        dataSaida: dataSaida, horaSaida: horaSaida,
      }).then(retorno => {
        resolve(retorno);
      });
    })

  /**
   * Grava saídas antecipadas recorrentes de uma vez só.
   *
   * @memberof FirebaseService
   */
  public gravarSaidaAntecipadaRecorrenteFirebaseFirestore = async (
    portarias: string[],
    est_ids: string[],
    dataSaida: string,
    horaSaida: string,
    segunda: number,
    terca: number,
    quarta: number,
    quinta: number,
    sexta: number,
    sabado: number,
  ) => new Promise((resolve) => {
    const gravarSaidaAntecipadaRecorrente = firebase.functions().httpsCallable('gravarSaidaAntecipadaRecorrente');
    gravarSaidaAntecipadaRecorrente({
      portarias: portarias,
      est_ids: est_ids,
      dataSaida: dataSaida,
      horaSaida: horaSaida,
      segunda: segunda,
      terca: terca,
      quarta: quarta,
      quinta: quinta,
      sexta: sexta,
      sabado: sabado,
    }).then(retorno => {
      resolve(retorno);
    });
  })

  /**
   * Apagar dados da portaria chamando um conjunto de funções do cloud functions
   * @memberof FirebaseService
   */
  public apagarPortariaFirebaseFirestore = async (codigoPortaria: string) => new Promise((resolve) => {
    const apagarAtrasosPortaria = firebase.functions().httpsCallable('apagarAtrasosPortaria');
    apagarAtrasosPortaria(codigoPortaria).then((retorno) => {
      resolve(retorno);
    });

    const apagarCronogramaPortaria = firebase.functions().httpsCallable('apagarCronogramaPortaria');
    apagarCronogramaPortaria(codigoPortaria).then((retorno) => {
      resolve(retorno);
    });

    const apagarEntradasPortaria = firebase.functions().httpsCallable('apagarEntradasPortaria');
    apagarEntradasPortaria(codigoPortaria).then((retorno) => {
      resolve(retorno);
    });

    const apagarMatriculadosPortaria = firebase.functions().httpsCallable('apagarMatriculadosPortaria');
    apagarMatriculadosPortaria(codigoPortaria).then((retorno) => {
      resolve(retorno);
    });

    const apagarParametrosPortaria = firebase.functions().httpsCallable('apagarParametrosPortaria');
    apagarParametrosPortaria(codigoPortaria).then((retorno) => {
      resolve(retorno);
    });

    const apagarSaidasPortaria = firebase.functions().httpsCallable('apagarSaidasPortaria');
    apagarSaidasPortaria(codigoPortaria).then((retorno) => {
      resolve(retorno);
    });

    const apagarSemUniformePortaria = firebase.functions().httpsCallable('apagarSemUniformePortaria');
    apagarSemUniformePortaria(codigoPortaria).then((retorno) => {
      resolve(retorno);
    });
  })
}
