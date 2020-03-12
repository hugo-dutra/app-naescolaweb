import { Turma } from '../crud/turma/turma.model';
import * as CryptoJS from 'crypto-js';

export class CONSTANTES {


  // Quantidade de passo que a string será convertida para base 64 - Profundidade da encriptação.
  public static PASSO_CRIPT = 5;
  public static PRODUCAO = true; // no deploy essa linha deverá ser trocada
  public static DEF_MSG_ERRO = 'ERROR 404 NOT FOUND';
  public static TEMPO_CONSULTA_ALERTAS = 1800000;

  public static ESCOPO_GLOBAL = 'Global';
  public static ESCOPO_REGIONAL = 'Regional';
  public static ESCOPO_LOCAL = 'Local';
  // ********************URLS****************************/
  public static BUILD_DESTINO = '2';

  public static BUILD_SEDF = '1';
  public static BUILS_RESOLVIDOS = '2';
  /* ------ */
  public static NOME_SISTEMA_SEDF = 'Acadêmico';
  public static NOME_SISTEMA_RESOLVIDOS = 'SupervisorEscolar';

  public static CAMINHO_LOGO_SEDF = '../../../assets/images/sedf_login.png';
  public static CAMINHO_LOGO_GDF = '../../assets/images/logo_gdf.png';
  public static CAMINHO_LOGO_RESOLVIDOS = '../../../assets/images/supervisor_escolar_login.png';

  public static HOST = 'http://localhost:8000'; // 2
  // public static HOST = 'https://supervisorescolar.com.br'; // 2
  // public static HOST = "http://academico.se.df.gov.br"; // 1

  public static HOST_API = CONSTANTES.HOST + '/api/';
  public static CK = 'OEqpJdFaYtaY0eI087eNA6KKSMsi22vh';
  // ********************FILES**************************/
  public static NO_AVATAR_URL = CONSTANTES.HOST + '/images/avatars/noavatar.jpg';
  public static NO_LOGO_URL = CONSTANTES.HOST + '/images/logos/nologo.jpg';
  // ******************PARAMETERS ANIMATIONS*************************/
  public static ANIMATION_DELAY_TIME: number = 400;
  // ******************IMAGES PARAMETERS*************************/
  public static GIF_WAITING_WIDTH = 75;
  public static GIF_WAITING_HEIGTH = 75;

  // *****************LISTAGEM DE TURMAS PADRAO******************/
  public static TURMAS_PADRAO: Turma /*Turma*/[] = [
    { id: null, ano: null, esc_id: null, nome: 'A', sre_id: null, trn_id: null },
    { id: null, ano: null, esc_id: null, nome: 'B', sre_id: null, trn_id: null },
    { id: null, ano: null, esc_id: null, nome: 'C', sre_id: null, trn_id: null },
    { id: null, ano: null, esc_id: null, nome: 'D', sre_id: null, trn_id: null },
    { id: null, ano: null, esc_id: null, nome: 'E', sre_id: null, trn_id: null },
    { id: null, ano: null, esc_id: null, nome: 'F', sre_id: null, trn_id: null },
    { id: null, ano: null, esc_id: null, nome: 'G', sre_id: null, trn_id: null },
    { id: null, ano: null, esc_id: null, nome: 'H', sre_id: null, trn_id: null },
    { id: null, ano: null, esc_id: null, nome: 'I', sre_id: null, trn_id: null },
    { id: null, ano: null, esc_id: null, nome: 'J', sre_id: null, trn_id: null },
    { id: null, ano: null, esc_id: null, nome: 'K', sre_id: null, trn_id: null },
    { id: null, ano: null, esc_id: null, nome: 'L', sre_id: null, trn_id: null },
    { id: null, ano: null, esc_id: null, nome: 'M', sre_id: null, trn_id: null },
    { id: null, ano: null, esc_id: null, nome: 'N', sre_id: null, trn_id: null },
    { id: null, ano: null, esc_id: null, nome: 'O', sre_id: null, trn_id: null },
    { id: null, ano: null, esc_id: null, nome: 'P', sre_id: null, trn_id: null },
    { id: null, ano: null, esc_id: null, nome: 'Q', sre_id: null, trn_id: null },
    { id: null, ano: null, esc_id: null, nome: 'R', sre_id: null, trn_id: null },
    { id: null, ano: null, esc_id: null, nome: 'S', sre_id: null, trn_id: null },
    { id: null, ano: null, esc_id: null, nome: 'T', sre_id: null, trn_id: null },
    { id: null, ano: null, esc_id: null, nome: 'U', sre_id: null, trn_id: null },
    { id: null, ano: null, esc_id: null, nome: 'V', sre_id: null, trn_id: null },
    { id: null, ano: null, esc_id: null, nome: 'W', sre_id: null, trn_id: null },
    { id: null, ano: null, esc_id: null, nome: 'X', sre_id: null, trn_id: null },
    { id: null, ano: null, esc_id: null, nome: 'Y', sre_id: null, trn_id: null },
    { id: null, ano: null, esc_id: null, nome: 'Z', sre_id: null, trn_id: null },
  ];

  // *****************FIREBASE PUSH******************//
  public static FIREBASE_MSG_ANEXO: string = '0';
  public static FIREBASE_MSG_ATIVIDADE: string = '1';
  public static FIREBASE_MSG_COMUNICADO: string = '2';
  public static FIREBASE_MSG_ENTRADA: string = '3';
  public static FIREBASE_MSG_HORARIO: string = '4';
  public static FIREBASE_MSG_OCORRENCIA: string = '5';
  public static FIREBASE_MSG_SAIDA: string = '6';
  public static FIREBASE_MSG_PUBLICIDADE_CODIGO: string = '7';
  public static FIREBASE_MSG_PUBLICIDADE_LINK: string = '8';

  // *****************FIREBASE STORAGE******************//
  public static FIREBASE_STORAGE_BASE_PATH = 'naescolaweb';
  public static FIREBASE_STORAGE_REDE_ENSINO: string = 'redeensino';
  public static FIREBASE_STORAGE_ESCOLA: string = 'escola';
  public static FIREBASE_STORAGE_ESTUDANTE: string = 'estudante';
  public static FIREBASE_STORAGE_DIRETOR: string = 'diretor';
  public static FIREBASE_STORAGE_USUARIO: string = 'usuario';
  // tslint:disable-next-line: max-line-length
  public static FIREBASE_MODELO_PLANILHA_IMPORTACAO: string = 'https://firebasestorage.googleapis.com/v0/b/naescola2018.appspot.com/o/naescolaweb%2Fmodelos%2Falunos.xlsx?alt=media&token=2e5c1870-6424-4055-ace3-4b74f3189bf3';

  // ******************BOLETO FÁCIL***********************/
  // tslint:disable-next-line: max-line-length
  // public static BOLETO_FACIL_URL_BASE = "https://sandbox.boletobancario.com/boletofacil/integration/api/v1/issue-charge?token=";
  public static BOLETO_FACIL_URL_BASE =
    'https://www.boletobancario.com/boletofacil/integration/api/v1/issue-charge?token=';
  // public static BOLETO_FACIL_TOKEN = "E29D110AE6CBF24F6EEABC7FA5093D7950AB7E003A1142DAF8BDBC9EE9BB3FF5";
  public static BOLETO_FACIL_TOKEN = 'E655E1F6A5192B2034BA769887C2EA1B12ABF8624EEF89B9A94B530582E4366A';
  public static BOLETO_FACIL_LIMITE_DIAS_PAGAMENTO = 29;
  public static BOLETO_FACIL_LIMITE_DIAS_PAGAMENTO_PEDIDO_CARTAO = 7;
  public static BOLETO_FACIL_DIAS_ADICIONADOS_BOLETO_PEDIDO_CARTAO = 5;
  public static BOLETO_FACIL_DIA_PADRAO_VENCIMENTO = 28;

  // ******************MENSAGENS PADRAO***********************/
  public static MSG_ERRO_PADRAO = 'Ocorreu um erro.';
  public static MSG_SUCESSO_PADRAO = 'Operacao finalizada com sucesso.';
}


