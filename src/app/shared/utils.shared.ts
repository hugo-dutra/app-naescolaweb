import { Router } from '@angular/router';
import { CONSTANTES } from './constantes.shared';
import * as CryptoJS from 'crypto-js';

import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as ExcelProper from 'exceljs';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

/**
 *Classe com métodos que serão usados em muitas classes
 *
 * @export
 * @class Utils
 */
export class Utils {

  public static removerCaracteresEspeciaisArray(array: Object[]): Object[] {
    const arrayInicial = array;
    const arrayFinal = new Array<Object>();
    arrayInicial.forEach((elemento: Object) => {
      elemento['nome'] = this.ajusteDeString(elemento['nome']);
      elemento['nome_mae'] = this.ajusteDeString(elemento['nome_mae']);
      elemento['nome_pai'] = this.ajusteDeString(elemento['nome_pai']);
      elemento['nome_resp'] = this.ajusteDeString(elemento['nome_resp']);
      elemento['complemento'] = this.ajusteDeString(elemento['complemento']);
      elemento['loc_no'] = this.ajusteDeString(elemento['loc_no']);
      elemento['log_no'] = this.ajusteDeString(elemento['log_no']);
      elemento['bai_no'] = this.ajusteDeString(elemento['bai_no']);

      arrayFinal.push(elemento);
    });
    return arrayFinal;
  }


  private static ajusteDeString(originalString: string): string {
    let retorno = '';
    const arrayDeCaracteresValidos = ['', ',', ' ', '!', '"', '#', '$', '%', '&', '(', ')', '*', '+', ',', '-', '.',
      '/', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '<', '=', '>', '?', '@', 'A', 'B', 'C', 'D',
      'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
      '[', ']', '^', '_', '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q',
      'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '{', '|', '}', 'ª', '®', '°', '´', '·', '¸', 'º', 'À', 'Á', 'Â',
      'Ã', 'Ç', 'È', 'É', 'Ê', 'Ì', 'Í', 'Î', 'Ò', 'Ó', 'Ô', 'Õ', 'Ù',
      'Ú', 'à', 'á', 'â', 'ã', 'ç', 'è', 'é', 'ê',
      'ì', 'í', 'ò', 'ó', 'ô', 'õ', '÷', 'ù', 'ú'];
    if (originalString != null && originalString != undefined) {
      for (let i = 0; i < originalString.length; i++) {
        const caractereAvaliado = originalString[i];
        const indiceObjeto = arrayDeCaracteresValidos.indexOf(caractereAvaliado);
        if (indiceObjeto > -1) {
          retorno += caractereAvaliado;
        }
      }
    }

    return retorno;
  }

  /**
   * Gera a listagem em arquivo excel .xlsx
   * @param listagem
   * @param nomeDoArquivoGerado
   * IMPORTANTE FAZER ARRAY MAP PARA AJUSTES DOS TITULOS DOS CAMPOS
   */
  public static gerarLista(listagem: Array<Object>, nomeDoArquivoGerado: string): void {
    if (listagem.length > 0) {
      const colunas = Object.keys(listagem[0]).length;
      const modeloPlanilhaListagem: ExcelProper.Workbook = new Excel.Workbook();
      modeloPlanilhaListagem.addWorksheet(nomeDoArquivoGerado);
      const tipoBlobArquivo: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      modeloPlanilhaListagem.worksheets[0].addRow([nomeDoArquivoGerado]);
      modeloPlanilhaListagem.worksheets[0].mergeCells(1, colunas, 0, 0);
      modeloPlanilhaListagem.worksheets[0].getCell(1, 1).alignment = { vertical: 'middle', horizontal: 'center' };
      const camposDePreenchimento = Object.keys(listagem[0]);
      modeloPlanilhaListagem.worksheets[0].addRows([camposDePreenchimento]);

      listagem.forEach(dadoDaLista => {
        const dadosLista = Object.values(dadoDaLista);
        modeloPlanilhaListagem.worksheets[0].addRows([dadosLista]);
      });

      // Preenchimento do background da planilha para facilitar a utilização feita pelo usuário
      for (let i = 0; i < listagem.length + 4; i++) {
        if (i % 2 == 0) {
          for (let j = 0; j < colunas; j++) {
            // Formada a entrada de dados para se comportarem como strings.
            modeloPlanilhaListagem.worksheets[0].getRow(i).getCell(j + 1).numFmt = '';
            modeloPlanilhaListagem.worksheets[0].getRow(i).getCell(j + 1).fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFDDDDDD' },
              bgColor: { argb: 'FFDDDDDD' },
            };
            modeloPlanilhaListagem.worksheets[0].getRow(i).getCell(j + 1).border = {
              top: { style: 'thin', color: { argb: 'FFBBBBBB' } },
              left: { style: 'thin', color: { argb: 'FFBBBBBB' } },
              bottom: { style: 'thin', color: { argb: 'FFBBBBBB' } },
              right: { style: 'thin', color: { argb: 'FFBBBBBB' } },
            };
          }
        }
      }

      // Ajusta tamanho das colunas para preenchimento dos dados
      for (let i = 0; i < modeloPlanilhaListagem.worksheets[0].columns.length; i++) {
        modeloPlanilhaListagem.worksheets[0].columns[i].width = 30;
      }

      // Gerar o arquivo e dispara o download
      modeloPlanilhaListagem.xlsx.writeBuffer().then((data: Blob) => {
        const blob = new Blob([data], { type: tipoBlobArquivo });
        FileSaver.saveAs(blob, `${nomeDoArquivoGerado}.xlsx`);
      });
    }
  }

  public static gerarListaAgrupada(listagem: Array<Object>, nomeDoArquivoGerado: string, campoAgrupamento: string): void {
    if (listagem.length > 0) {
      const colunas = Object.keys(listagem[0]).length;
      const modeloPlanilhaListagem: ExcelProper.Workbook = new Excel.Workbook();

      const workSheets = <ExcelProper.Worksheet[]>Utils.eliminaValoresRepetidos(listagem, campoAgrupamento);
      const tipoBlobArquivo: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

      workSheets.forEach((workSheet, idx) => {
        modeloPlanilhaListagem.addWorksheet(workSheet[campoAgrupamento]);
        modeloPlanilhaListagem.worksheets[idx].addRow([`${nomeDoArquivoGerado}`]);
        modeloPlanilhaListagem.worksheets[idx].mergeCells(1, colunas, 0, 0);
        modeloPlanilhaListagem.worksheets[idx].getCell(1, 1).alignment = { vertical: 'middle', horizontal: 'center' };
        const camposDePreenchimento = Object.keys(listagem[0]);
        modeloPlanilhaListagem.worksheets[idx].addRows([camposDePreenchimento]);
      });

      //Agrupa os dados nos locais adequados.
      workSheets.forEach((workSheet, idx) => {
        listagem.forEach((dadoDaLista) => {
          if (workSheet[campoAgrupamento] == dadoDaLista[campoAgrupamento]) {
            const dadosLista = Object.values(dadoDaLista);
            modeloPlanilhaListagem.worksheets[idx].addRows([dadosLista]);
          }
        });
      });

      // Preenchimento do background da planilha para facilitar a utilização feita pelo usuário
      workSheets.forEach((wS, idx) => {
        for (let i = 0; i < Math.floor(listagem.length / workSheets.length) * 2; i++) {
          if (i % 2 == 0) {
            for (let j = 0; j < colunas; j++) {
              // Formada a entrada de dados para se comportarem como strings.
              modeloPlanilhaListagem.worksheets[idx].getRow(i).getCell(j + 1).numFmt = '';
              modeloPlanilhaListagem.worksheets[idx].getRow(i).getCell(j + 1).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFDDDDDD' },
                bgColor: { argb: 'FFDDDDDD' },
              };
              modeloPlanilhaListagem.worksheets[idx].getRow(i).getCell(j + 1).border = {
                top: { style: 'thin', color: { argb: 'FFBBBBBB' } },
                left: { style: 'thin', color: { argb: 'FFBBBBBB' } },
                bottom: { style: 'thin', color: { argb: 'FFBBBBBB' } },
                right: { style: 'thin', color: { argb: 'FFBBBBBB' } },
              };
            }
          }
        }
      });

      // Ajusta tamanho das colunas para preenchimento dos dados
      workSheets.forEach((wS, idx) => {
        for (let i = 0; i < modeloPlanilhaListagem.worksheets[idx].columns.length; i++) {
          modeloPlanilhaListagem.worksheets[idx].columns[i].width = 30;
        }
      });

      // Gerar o arquivo e dispara o download
      modeloPlanilhaListagem.xlsx.writeBuffer().then((data: Blob) => {
        const blob = new Blob([data], { type: tipoBlobArquivo });
        FileSaver.saveAs(blob, `${nomeDoArquivoGerado}.xlsx`);
      });
    }
  }



  public static validarCampos(model: { event: Event }): void {
    if (!(<HTMLInputElement>event.target).validity.valid) {
      (<HTMLInputElement>event.target).classList.add('is-invalid');
    } else {
      (<HTMLInputElement>event.target).classList.remove('is-invalid');
    }
  }

  public static eliminaValoresRepetidos(arrayAlvo: Object[], campo: string): Object[] {
    return Array.from(new Set(arrayAlvo.map(a => a[campo])))
      .map(id => {
        return arrayAlvo.find(a => a[campo] == id);
      });
  }

  public static cypher(entrada: string): CryptoJS.WordArray {
    return CryptoJS.AES.encrypt(entrada, CONSTANTES.CK);
  }

  public static decypher(entrada: string): string {
    return CryptoJS.AES.decrypt(entrada, CONSTANTES.CK).toString(CryptoJS.enc.Utf8);
  }

  public static cypherQRCode(entrada: string): CryptoJS.WordArray {
    return CryptoJS.AES.encrypt(entrada, CONSTANTES.CKQRC);
  }

  public static decypherQRCode(entrada: string): string {
    return CryptoJS.AES.decrypt(entrada, CONSTANTES.CKQRC).toString(CryptoJS.enc.Utf8);
  }

  public static abreviarNome(nome: string): string {
    const arrayDePalavras = nome.split(' ');
    let stringRetorno = '';
    arrayDePalavras.forEach((palavra: string) => {
      const primeiroCaracter = palavra.charAt(0).toUpperCase();
      stringRetorno += primeiroCaracter;
    });
    return stringRetorno;
  }

  public static abreviarNomeDisciplina(nome: string): string {
    const arrayDePalavras = nome.split(' ');
    let stringRetorno = '';
    if (arrayDePalavras.length == 1) {
      stringRetorno = arrayDePalavras[0].substr(0, 3);
    } else {
      arrayDePalavras.forEach((palavra: string) => {
        const primeiroCaracter = palavra.charAt(0).toUpperCase();
        stringRetorno += primeiroCaracter;
      });
    }



    return stringRetorno;
  }

  public static now(): string {
    const data = new Date();
    return (
      data.getFullYear().toString() +
      '-' +
      ('0' + (data.getMonth() + 1)).slice(-2).toString() +
      '-' +
      ('0' + (data.getDate())).slice(-2).toString() +
      ' ' +
      data.getHours().toString() +
      ':' +
      data.getMinutes().toString() +
      ':' +
      data.getSeconds().toString()
    );
  }

  public static horaAtual(): string {
    const data = new Date();
    return (
      data.getHours().toString() +
      ':' +
      data.getMinutes().toString() +
      ':' +
      data.getSeconds().toString()
    );
  }

  public static dataAtual(): string {
    const data = new Date();
    return (
      data.getFullYear().toString() +
      '-' +
      ('0' + (data.getMonth() + 1)).slice(-2).toString() +
      '-' +
      ('0' + (data.getDate())).slice(-2).toString()
    );
  }

  public static gravarErroAnalytics(erro: string) {
    // Depois que descobrir como logar exceções, alterar aqui.
    /* (<any>window).ga('send', {
      hitType: 'erro',
      eventCategory: 'FEO',
      eventAction: 'error',
      eventLabel: 'Mensagem de erro aqui'
    }); */
  }

  public static tratarErro(rota: { router: Router; response: Response }): void {
    try {
      if (
        rota.response.json['error'] == 'token_expired' ||
        rota.response.json['error'] == 'token_not_provided'
      ) {
        rota.router.navigate(['']);
        localStorage.setItem('ne_token', 'null');
        window.location.reload();
      }
    } catch (error) {
      /* console.log('Erro'); */
    }
  }

  public static encriptBtoA(string: string, profundidade: number): string {
    let retorno = string;
    if (string != null && string != undefined && string != '') {
      for (let i = 0; i < profundidade; i++) {
        retorno = btoa(unescape(encodeURIComponent(retorno)));
      }
    }
    return retorno;
  }

  public static decriptAtoB(string: string, profundidade: number): string {
    let retorno = string;
    if (string != null && string != undefined && string != '') {
      for (let i = 0; i < profundidade; i++) {
        retorno = decodeURIComponent(escape(window.atob(retorno)));
      }
    }
    return retorno;
  }


  public static verificarPermissoes(): Object {
    try {
      const str_obj = Utils.decriptAtoB(
        localStorage.getItem('perm'),
        CONSTANTES.PASSO_CRIPT,
      );
      return JSON.parse(str_obj);
    } catch (error) {
      return null;
    }
  }

  public static verificarDados(): Object {
    try {
      const str_obj = Utils.decriptAtoB(localStorage.getItem('dados'), CONSTANTES.PASSO_CRIPT);
      return JSON.parse(str_obj);
    } catch (error) {
      return null;
    }
  }

  public static pegarDadosEscopo(): { esc_id, usr_id, epu_id, nome, nivel } {
    try {
      const str_escopo = Utils.decriptAtoB(localStorage.getItem('escopo_perfil'), CONSTANTES.PASSO_CRIPT);
      const objetoRetorno = JSON.parse(str_escopo)[0];
      return {
        esc_id: objetoRetorno['esc_id'], usr_id: objetoRetorno['usr_id'], epu_id: objetoRetorno['epu_id'],
        nome: objetoRetorno['nome'], nivel: objetoRetorno['nivel'],
      };
    } catch (error) {
      return null;
    }
  }



  public static verificarGrupos(): Object {
    try {
      const str_obj = Utils.decriptAtoB(
        localStorage.getItem('grupos'),
        CONSTANTES.PASSO_CRIPT,
      );
      return JSON.parse(str_obj);
    } catch (error) {
      return null;
    }
  }

  public static verificarMenus(): Object {
    try {
      const str_obj = Utils.decriptAtoB(
        localStorage.getItem('menus'),
        CONSTANTES.PASSO_CRIPT,
      );
      return JSON.parse(str_obj);
    } catch (error) {
      return null;
    }
  }

  public static validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, '');

    if (cnpj == '') return false;

    if (cnpj.length != 14)
      return false;

    // Elimina CNPJs invalidos conhecidos
    if (cnpj == '00000000000000' ||
      cnpj == '11111111111111' ||
      cnpj == '22222222222222' ||
      cnpj == '33333333333333' ||
      cnpj == '44444444444444' ||
      cnpj == '55555555555555' ||
      cnpj == '66666666666666' ||
      cnpj == '77777777777777' ||
      cnpj == '88888888888888' ||
      cnpj == '99999999999999')
      return false;

    // Valida DVs
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    const digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
        pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
      return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
        pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
      return false;

    return true;
  }

  public static exibirComponente(rota: string): boolean {
    const permissoes: Object = Utils.verificarPermissoes();
    for (const key in permissoes) {
      if (permissoes[key]['rota'] == rota) {
        return true;
      }
    }
    return false;
  }

  public static pegarDadosEscola(): Object {
    return JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados_escola'), CONSTANTES.PASSO_CRIPT))[0];
  }

  public static pegarDadosEscolaDetalhado(): {
    id, ren_id, nome, email,
    telefone, endereco, logo, ree_id, inep
    cep, cnpj, rede_ensino, abv_rede_ensino,
    email_rede_ensino, responsavel_rede_ensino,
    telefone_rede_ensino, endereco_rede_ensino,
    cnpj_rede_ensino, logo_rede_ensino, nome_abreviado,
  } {
    return JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados_escola'), CONSTANTES.PASSO_CRIPT))[0];
  }

  public static gerarNomeUnico(): string {
    return Utils.encriptBtoA('_' + Math.random().toString(36).substr(1, 9) +
      '_' + Date.now().toString(), CONSTANTES.PASSO_CRIPT);
  }

  public static formatarDataPadraoAmericano(dataFormatoBrasileiro: string): string {
    const arrayDataBrasileiro: Array<string> = dataFormatoBrasileiro.split('/');
    const arrayDataAmericano = arrayDataBrasileiro[2] + '-' + arrayDataBrasileiro[1] + '-' + arrayDataBrasileiro[0];
    return arrayDataAmericano;
  }

  public static pegarNomeClasseMetodo(): string {
    const err = (new Error).stack;
    return err;
  }

  public static gerarDigitosCodigoDeBarras(matricula: string, anoAtual: number) {
    const digitos = matricula.length;
    const ano = anoAtual.toString();
    let invertida = '';

    for (let i = 0; i < digitos; i++) {
      invertida += matricula[digitos - i - 1];
    }

    for (let i = 0; i < ano.length; i++) {
      if (i < digitos) {
        const digitoInserido = ano[ano.length - 1 - i];
        const enderecoParaInserir = 2 * i + 1;
        invertida = invertida.substr(0, enderecoParaInserir) + digitoInserido + invertida.substr(enderecoParaInserir);
      } else {
        const digitoInserido = ano[ano.length - 1 - i];
        const enderecoParaInserir = invertida.length;
        invertida = invertida.substr(0, enderecoParaInserir) + digitoInserido + invertida.substr(enderecoParaInserir);
      }
    }
    return invertida + '*';
  }
}
