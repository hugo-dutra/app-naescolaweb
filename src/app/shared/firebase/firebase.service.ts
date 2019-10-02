import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { MessageFirebase } from "../firebase/message.model";
import * as firebase from "firebase";
import 'firebase/firestore' //***** */
import { FirebaseUpload } from "./firebase.upload.model";
//import { Portaria } from "src/app/crud/portaria/portaria.model";
//import { CronogramaPortaria } from "src/app/crud/portaria/cronograma-portaria.model";
import { Utils } from "../utils.shared";
import { CONSTANTES } from "../constantes.shared";
import { RequestOptions } from 'http';
import { Portaria } from '../../crud/portaria/portaria.model';
import { CronogramaPortaria } from '../../crud/portaria/cronograma-portaria.model';

@Injectable()
export class FirebaseService {
  private firestore = firebase.firestore();
  //private sett = { timestampsInSnapshots: true };
  constructor(private http: HttpClient) {
    //this.firestore.settings(this.sett);
  }

  //****************************************************************************/
  //******************************PUSH******************************************/
  public enviarPushFirebase(topico: string, titulo: string): Observable<any> {
    try {
      const headers = {
        headers: new HttpHeaders()
          .append('Content-type', 'application/json')
          .append('Authorization', 'Key=AAAAH0kr4hA:APA91bGlwDwDSBHclBxLBA74s-GT3otyDdmmmGJpNgoxISElSsrnMq1TevXDea5hBrWRpRsK8JDFsB5Af10wWrkstMkCAqGh-tjGseeZcUjPSJU62JtyD9xNDtC52NzsClr-L5SkmFKE')
      }

      var message = {
        to: "/topics/" + topico,
        notification: {
          title: "NaEscola",
          body: titulo,
        },
        TimeToLive: 2400000
      };
      return this.http.post("https://fcm.googleapis.com/fcm/send", message, headers);
    } catch (error) {
      console.log(error);
    }

  }


  //****************************************************************************/
  //***************************STORAGE******************************************/
  public enviarArquivoFirebase(firebaseUpload: FirebaseUpload, basePath: string): Promise<any> {
    let storageRef = firebase.storage().ref();
    return storageRef.child(`${basePath}/${firebaseUpload.name}`).put(firebaseUpload.file).then((retorno) => {
      // alert(retorno)
    });
  }

  public pegarUrlArquivoUpload(firebaseUpload: FirebaseUpload, basePath: string): Promise<any> {
    let storageRef = firebase.storage().ref();
    return storageRef.child(`${basePath}/${firebaseUpload.name}`).getDownloadURL()
  }
  //*****************************************************************************/
  //***************************FIRESTORE*****************************************/



  public gravarSugestaoInformacaoBug = async (rota, detalhesInformacao) => {
    const dataInformacao = Utils.dataAtual();
    const horaInformacao = Utils.horaAtual();

    //**************DADOS ESCOLA**************/
    const dadosEscola = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados_escola'), CONSTANTES.PASSO_CRIPT))[0];
    const inep = dadosEscola["inep"];
    const esc_id = dadosEscola["id"];
    const nome_escola = dadosEscola["nome"];
    const rede_ensino = dadosEscola["rede_ensino"];
    //**************DADOS USUÁRIO**************/
    const dadosUsuario = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados'), CONSTANTES.PASSO_CRIPT))[0];
    const usr_id = dadosUsuario["id"];
    const nome_usuario = dadosUsuario["nome"];

    return new Promise(resolve => {
      this.firestore
        .collection('sugestoesErrosBugsNaEscolaWeb')
        .doc(rede_ensino)
        .collection('escolas')
        .doc(inep)
        .collection("informacoes")
        .add({
          data: dataInformacao,
          hora: horaInformacao,
          esc_id: esc_id,
          escola: nome_escola,
          usr_id: usr_id,
          nome_usuario: nome_usuario,
          rota: rota,
          detalhesInformacao: detalhesInformacao
        }).then((retorno) => {
          resolve(retorno);
        }).catch((error: Response) => {
          resolve(error);
        })
    })
  }
  /**
   *  Grava, na portaria, toda a listagem dos estudantes da escola num único documento.
   * @memberof FirebaseService
   */
  public gravarListagemEstudantesPortariaDocumentoUnico = (estudantes: Object[], codigoPortaria: string, parteArray: number): Promise<any> => {
    //**************DADOS ESCOLA**************/
    return new Promise((resolve, reject) => {
      this.firestore
        .collection('portariaWeb')
        .doc(codigoPortaria)
        .collection('listagem_carga_estudantes')
        .doc(parteArray.toString())
        .set({ estudantes: estudantes }).then(() => {
          resolve({ retorno: 'ok' })
        }).catch((reason: any) => {
          reject({ retorno: reason })
        })
    })
  }

  /**
   * Procedure Grava us usuários autorizados a tirar fotografias.
   * @param usuarios
   */
  public gravarUsuariosAutorizadosTirarFotos(usuarios: Object[], inep: string): Promise<Object> {
    return new Promise((resolve) => {
      let contaUsuariosCadastrados: number = 0;
      const totalUsuariosCadastrados: number = usuarios.length;
      usuarios.forEach(usuario => {
        const usr_id: number = usuario['usr_id'];
        this.firestore
          .collection('naescolaApp')
          .doc(inep)
          .collection('permissoes')
          .doc(usr_id.toString()).set({ fotos: true }).then(() => {
          })
        contaUsuariosCadastrados++;
        if (contaUsuariosCadastrados == totalUsuariosCadastrados) {
          resolve('usuarios cadastrados');
        }
      })

    })
  }

  /**
   * Grava, no aplicativo, toda a listagem dos estudantes da escola num único documento.
   * @memberof FirebaseService
   */
  public gravarListagemEstudantesAplicativoDocumentoUnico = (estudantes: Object[], parteArray: number): Promise<any> => {
    //**************DADOS ESCOLA**************/
    const dadosEscola = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados_escola'), CONSTANTES.PASSO_CRIPT))[0];
    const inep = dadosEscola["inep"];
    return new Promise((resolve, reject) => {
      this.firestore
        .collection('naescolaApp')
        .doc(inep)
        .collection('listagens')
        .doc('modoAdmin')
        .collection('estudantes')
        .doc(parteArray.toString()).set({ estudantes }).then(() => {
          resolve({ retorno: 'ok' })
        }).catch((reason: any) => {
          reject({ retorno: reason })
        })
    })
  }

  public gravarListagemEstudantesAplicativoAdministrativoBatch(estudantes: Object[]): Promise<any> {
    const dadosEscola = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados_escola'), CONSTANTES.PASSO_CRIPT))[0];
    const inepEscola = dadosEscola["inep"];
    return new Promise((resolve) => {
      let batch = this.firestore.batch();
      estudantes.forEach((estudante: Object) => {
        const escola = estudante['escola'];
        const etapa = estudante['etapa'];
        const foto = estudante['foto'];
        const inep = estudante['inep'];
        const matricula = estudante['matricula'];
        const nome = estudante['nome'];
        const serie = estudante['serie'];
        const telefoneEscola = estudante['telefoneEscola'];
        const turma = estudante['turma'];
        const turno = estudante['turno'];
        let referenciaEstudante = this.firestore.collection('naescolaApp').doc(inepEscola).collection('matriculados').doc(estudante['matricula'])
        batch.set(referenciaEstudante, { escola, etapa, foto, inep, matricula, nome, serie, telefoneEscola, turma, turno });
      })
      batch.commit().then(() => {
        resolve('ok');
      })
    })
  }

  public gravarListagemEstudanteAplicativoAdministrativo = (estudante: Object): Promise<any> => {
    const dadosEscola = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados_escola'), CONSTANTES.PASSO_CRIPT))[0];
    const inep = dadosEscola["inep"];
    return new Promise((resolve) => {
      this.firestore
        .collection('naescolaApp')
        .doc(inep)
        .collection('matriculados')
        .doc(estudante['matricula'])
        .set({ estudante }).then(() => {
          resolve('ok')
        })
    })
  }


  public gravarLogErro = async (localErro, detalhesErro) => {
    const dataErro = Utils.dataAtual();
    const horaErro = Utils.horaAtual();

    //**************DADOS ESCOLA**************/
    const dadosEscola = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados_escola'), CONSTANTES.PASSO_CRIPT))[0];
    const inep = dadosEscola["inep"];
    const esc_id = dadosEscola["id"];
    const nome_escola = dadosEscola["nome"];
    const rede_ensino = dadosEscola["rede_ensino"];
    //**************DADOS USUÁRIO**************/
    const dadosUsuario = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados'), CONSTANTES.PASSO_CRIPT))[0];
    const usr_id = dadosUsuario["id"];
    const nome_usuario = dadosUsuario["nome"];

    return new Promise(resolve => {
      this.firestore
        .collection('logErrosNaEscolaWeb')
        .doc(rede_ensino)
        .collection('escolas')
        .doc(inep)
        .collection("erros")
        .add({
          data: dataErro,
          hora: horaErro,
          esc_id: esc_id,
          escola: nome_escola,
          usr_id: usr_id,
          nome_usuario: nome_usuario,
          local_erro: localErro,
          detalhe_erro: detalhesErro
        }).then((retorno) => {
          resolve(retorno);
        }).catch((error: Response) => {
          resolve(error);
        })
    })
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
        .doc(messageFirebase.matricula)
        .collection('advertencias')
        .add({ data: messageFirebase.data, hora: messageFirebase.hora, categoria: messageFirebase.tipo_msg, leitura: 0 }).then((retorno) => {
          resolve(retorno);
        }).catch((error: Response) => {
          resolve(error);
        })
    })
  }
  /**
   *Gravar comunicados da direção.
   *
   * @memberof FirebaseService
   */
  public gravarComunicadoDirecaoFirebaseFirestore = async (messageFirebase: MessageFirebase) => {
    return new Promise(resolve => {
      this.firestore
        .collection('naescolaApp')
        .doc(messageFirebase.cod_inep)
        .collection('matriculados')
        .doc(messageFirebase.matricula)
        .collection('comunicados')
        .add({
          data: messageFirebase.data,
          hora: messageFirebase.hora,
          assunto: messageFirebase.titulo,
          msg: messageFirebase.msg,
          leitura: 0,
          anexo: [
            { nome: 'anexo1', tamanho: '20kb', anexo: "http://linkparaoarquivo", tipo: "pdf" },
            { nome: 'anexo2', tamanho: '40kb', anexo: "http://linkparaoarquivo", tipo: "pdf" },
          ]
        }).then((retorno) => {
          resolve(retorno);
        }).catch((error: Response) => {
          resolve(error);
        })
    })
  }

  public gravarMensagemFirebaseFirestore(messageFirebase: MessageFirebase): void {
    this.firestore.collection(messageFirebase.cod_inep).doc(messageFirebase.matricula).collection("mensagens").add(messageFirebase).then((retorno) => {
      console.log({ retorno });
    })
    let retorno = firebase.firestore().collection(messageFirebase.cod_inep).onSnapshot(() => {
    })
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
        resolve(querySnapshot)
      })
  })

  public lerDadosFrequenciaEntradaPortaria = async (codigoPortaria: string, ultimoRegistro: string) => new Promise((resolve) => {
    return this.firestore
      .collection("portariaWeb")
      .doc(codigoPortaria)
      .collection("passagens")
      .doc("entradas")
      .collection("registros").where("data", ">=", ultimoRegistro)
      .get()
      .then((querySnapshot: firebase.firestore.QuerySnapshot) => {
        resolve(querySnapshot);
      })
  })

  public lerDadosFrequenciaSaidaPortaria = async (codigoPortaria: string, ultimoRegistro: string) => new Promise((resolve) => {
    return this.firestore
      .collection("portariaWeb")
      .doc(codigoPortaria)
      .collection("passagens")
      .doc("saidas")
      .collection("registros").where("data", ">=", ultimoRegistro).get().then((querySnapshot: firebase.firestore.QuerySnapshot) => {
        resolve(querySnapshot);
      })
  })

  public lerDadosAtrasoPortaria = async (codigoPortaria: string) => new Promise((resolve) => {
    return this.firestore
      .collection("portariaWeb")
      .doc(codigoPortaria)
      .collection("ocorrencias")
      .doc("atrasos")
      .collection("registros").get().then((querySnapshot: firebase.firestore.QuerySnapshot) => {
        resolve(querySnapshot);
      })
  })

  public lerDadosSemUniformePortaria = async (codigoPortaria: string) => new Promise((resolve) => {
    return this.firestore
      .collection("portariaWeb")
      .doc(codigoPortaria)
      .collection("ocorrencias")
      .doc("sem uniforme")
      .collection("registros").get().then((querySnapshot: firebase.firestore.QuerySnapshot) => {
        resolve(querySnapshot);
      })
  })

  /**
   * Grava estudantes para serem carregados pelo aplicativo dos pais
   * @param inep
   * @param matricula
   * @param foto
   * @param nome
   * @param serie
   * @param turma
   * @param turno
   */
  public gravarEstudanteFirebaseFirestoreAplicativo(inep: string, matricula: string, foto: string, nome: string, serie: string, turma: string, turno: string, etapa: string): Promise<any> {
    return this.firestore
      .collection('naescolaApp')
      .doc(inep)
      .collection('matriculados')
      .doc(matricula)
      .set({ foto, nome, serie, turma, turno, etapa })
  }

  /**
   *  Grava configurações da portaria no servidor do FireBase
   * @param portaria
   */
  public gravarConfiguracaoFirebaseFirestorePortaria = async (portaria: Portaria) => new Promise((resolve) => {
    this.firestore
      .collection('portariaWeb')
      .doc(portaria.codigo)
      .collection('parametros')
      .doc('configuracao') // Aqui vai mudar para horário depois, no aplicativo
      .set(portaria)
      .then(() => { resolve('sucesso') })
      .catch(() => { alert('erro'); });
  });

  /**
   * Grava dados do cronograma da portaria
   *
   * @memberof FirebaseService
   */
  public gravarCronogramaFirebaseFirestorePortaria = async (cronogramaPortaria: CronogramaPortaria) => new Promise((resolve) => {
    this.firestore
      .collection('portariaWeb')
      .doc(cronogramaPortaria.codigoPortaria)
      .collection('cronogramas').doc(cronogramaPortaria.crpId.toString()).set({
        horarioInicio: cronogramaPortaria.horarioInicio,
        horarioFim: cronogramaPortaria.horarioFim,
        modoPortaria: cronogramaPortaria.modoPortaria,
      })
      .then(() => { resolve('sucesso') });
  });

  /**
   *Exclui cronograma INDIVIDUAL de acordo com o crp_id
   * @param cronogramaPortaria
   * @memberof FirebaseService
   */
  public apagarCronogramaFirebaseFirestorePortaria = async (cronogramaPortaria: CronogramaPortaria) => new Promise((resolve) => {
    this.firestore.collection('portariaWeb').doc(cronogramaPortaria['codigo_portaria']).collection('cronogramas').doc(cronogramaPortaria['crp_id'].toString()).delete().then(() => {
      resolve('sucesso');
    });
  });

  /**
   *Exclui matriculado INDIVIDUAL de acordo com a matricula
   * @param codigo_portaria
   * @param matricula
   * @memberof FirebaseService
   */
  public apagarMatriculadoFirebaseFirestorePortaria = async (codigo_portaria: string, matricula: string) => new Promise((resolve) => {
    this.firestore.collection('portariaWeb').doc(codigo_portaria).collection('matriculados').doc(matricula).delete().then(() => {
      resolve('sucesso');
    });
  });

  /**
   * Exclui configurações ÚNICAS de acordo com o código da portaria
   * @param codigo_portaria
   * @memberof FirebaseService
   */
  public apagarConfiguracaoFirebaseFirestorePortaria = async (codigo_portaria: string) => new Promise((resolve) => {
    this.firestore.collection('portariaWeb').doc(codigo_portaria).collection('parametros').doc('configuracao').delete().then(() => {
      resolve('sucesso');
    });
  });

  /**
   * Alterar as configurações ÚNICAS da portaria de acordo com o código da portaria.
   *
   * @memberof FirebaseService
   */
  public alterarConfiguracaoFirebaseFirestorePortaria = async (portaria: Portaria) => new Promise((resolve) => {
    this.firestore.collection('portariaWeb').doc(portaria.codigo).collection('parametros').doc('configuracao').set(portaria).then(() => {
      resolve('sucesso');
    });
  })

  /**
   * Apaga registro de saída antecipada eventual na portaria
   *
   * @memberof FirebaseService
   */
  public apagarSaidaAntecipadaEventual = async (codigo_portaria: string, matricula: string) => new Promise((resolve) => {
    this.firestore.collection('portariaWeb').doc(codigo_portaria).collection('saida_antecipada_eventual').doc(matricula).delete().then(() => {
      resolve('sucesso');
    });
  });


  /**
   * Apaga conjunto de estudantes matriculados cadastrados na portaria
   * @param codigo_portaria
   * @memberof FirebaseService
   */
  public apagarMatriculadosFirebaseFirestorePortaria = async (codigo_portaria: string) => new Promise((resolve) => {
    this.firestore.collection('portariaWeb').doc(codigo_portaria).collection('matriculados').get().then((retorno) => {
      const matriculados = retorno.docs;
      let contaExcluiMatriculados = 0;
      if (matriculados.length > 0) {
        matriculados.forEach((matriculado) => {
          const matricula = matriculado.id;
          this.apagarMatriculadoFirebaseFirestorePortaria(codigo_portaria, matricula).then(() => {
            contaExcluiMatriculados += 1
            if (contaExcluiMatriculados == matriculados.length) {
              resolve('ok');
            }
          })
        })
      } else {
        resolve('ok');
      }
    })
  });

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
          let cronogramaPortaria = new CronogramaPortaria()
          cronogramaPortaria['codigo_portaria'] = codigo_portaria;
          cronogramaPortaria['crp_id'] = parseInt(cronograma.id);
          this.apagarCronogramaFirebaseFirestorePortaria(cronogramaPortaria).then(() => {
            contaExcluiCronogramas += 1
            if (contaExcluiCronogramas == cronogramas.length) {
              resolve('ok');
            }
          })
        })
      } else {
        resolve('ok');
      }
    })
  });

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
        })
      })
    }).catch(() => {
      resolve('ok');
    })
  });

  /**
   *  Grava lista de estudantes para serem usados no aplicativo
   * @param codigoPortaria
   * @param matricula
   * @param foto
   * @param nome
   * @param serie
   * @param turma
   * @param turno
   * @param etapa
   */
  public gravarEstudanteFirebaseFirestorePortaria(codigoPortaria: string, matricula: string, foto: string, nome: string, serie: string, turma: string, turno: string, etapa: string): Promise<any> {
    return new Promise((resolve) => {
      this.firestore
        .collection('portariaWeb')
        .doc(codigoPortaria)
        .collection('matriculados')
        .doc(matricula)
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
  public gravarSaidaAntecipadaEventual(codigoPortaria: string, matricula: string, data: string, hora: string): Promise<any> {
    return new Promise((resolve) => {
      this.firestore
        .collection('portariaWeb')
        .doc(codigoPortaria)
        .collection('saida_antecipada_eventual')
        .doc(matricula)
        .set({ data, hora }).then(() => {
          resolve('ok');
        })
    })
  }

  //**********************************************************************************/
  //***************************CLOUD FUNCTION*****************************************/
  public carregarEstudantesPortariaFirebaseFirestore = async (estudantes: Object[], codigoPortaria: string) => new Promise((resolve) => {
    const carregarEstudantesPortaria = firebase.functions().httpsCallable('carregarEstudantesPortaria');
    carregarEstudantesPortaria({ estudantes: estudantes, codigoPortaria: codigoPortaria }).then(retorno => {
      resolve(retorno)
    })
  })

  public carregarEstudantesAplicativoFirebaseFirestore = async (estudantes: Object[], inep: string) => new Promise((resolve) => {
    const carregarEstudantesPortaria = firebase.functions().httpsCallable('carregarEstudantesAplicativo');
    carregarEstudantesPortaria({ estudantes: estudantes, inep: inep }).then(retorno => {
      resolve(retorno)
    })
  })


  /**
   * Grava saídas antecipadas eventuais de uma vez só.
   *
   * @memberof FirebaseService
   */
  public gravarSaidaAntecipadaEventualFirebaseFirestore = async (portarias: string[], matriculas: string[], dataSaida: string, horaSaida: string) => new Promise((resolve) => {
    const gravarSaidaAntecipadaEventual = firebase.functions().httpsCallable('gravarSaidaAntecipadaEventual');
    gravarSaidaAntecipadaEventual({ portarias: portarias, matriculas: matriculas, dataSaida: dataSaida, horaSaida: horaSaida }).then(retorno => {
      resolve(retorno)
    })
  })

  /**
   * Grava saídas antecipadas recorrentes de uma vez só.
   *
   * @memberof FirebaseService
   */
  public gravarSaidaAntecipadaRecorrenteFirebaseFirestore = async (
    portarias: string[],
    matriculas: string[],
    dataSaida: string,
    horaSaida: string,
    segunda: number,
    terca: number,
    quarta: number,
    quinta: number,
    sexta: number,
    sabado: number
  ) => new Promise((resolve) => {
    const gravarSaidaAntecipadaRecorrente = firebase.functions().httpsCallable('gravarSaidaAntecipadaRecorrente');
    gravarSaidaAntecipadaRecorrente({
      portarias: portarias,
      matriculas: matriculas,
      dataSaida: dataSaida,
      horaSaida: horaSaida,
      segunda: segunda,
      terca: terca,
      quarta: quarta,
      quinta: quinta,
      sexta: sexta,
      sabado: sabado
    }).then(retorno => {
      resolve(retorno)
    })
  })

  /**
   * Apagar dados da portaria chamando um conjunto de funções do cloud functions
   * @memberof FirebaseService
   */
  public apagarPortariaFirebaseFirestore = async (codigoPortaria: string) => new Promise((resolve) => {
    const apagarAtrasosPortaria = firebase.functions().httpsCallable('apagarAtrasosPortaria');
    apagarAtrasosPortaria(codigoPortaria).then((retorno) => {
      resolve(retorno);
    })

    const apagarCronogramaPortaria = firebase.functions().httpsCallable('apagarCronogramaPortaria');
    apagarCronogramaPortaria(codigoPortaria).then((retorno) => {
      resolve(retorno);
    })

    const apagarEntradasPortaria = firebase.functions().httpsCallable('apagarEntradasPortaria');
    apagarEntradasPortaria(codigoPortaria).then((retorno) => {
      resolve(retorno);
    })

    const apagarMatriculadosPortaria = firebase.functions().httpsCallable('apagarMatriculadosPortaria');
    apagarMatriculadosPortaria(codigoPortaria).then((retorno) => {
      resolve(retorno);
    })

    const apagarParametrosPortaria = firebase.functions().httpsCallable('apagarParametrosPortaria');
    apagarParametrosPortaria(codigoPortaria).then((retorno) => {
      resolve(retorno);
    })

    const apagarSaidasPortaria = firebase.functions().httpsCallable('apagarSaidasPortaria');
    apagarSaidasPortaria(codigoPortaria).then((retorno) => {
      resolve(retorno);
    })

    const apagarSemUniformePortaria = firebase.functions().httpsCallable('apagarSemUniformePortaria');
    apagarSemUniformePortaria(codigoPortaria).then((retorno) => {
      resolve(retorno);
    })
  })
}