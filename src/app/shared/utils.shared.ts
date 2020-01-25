import { Router } from "@angular/router";
import { CONSTANTES } from "./constantes.shared";
import * as CryptoJS from 'crypto-js';

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
      elemento['nome'] = elemento['nome'] != null ? elemento['nome'].replace(/[^\u0020-\u007a]/g, '') : null;
      elemento['nome_mae'] = elemento['nome_mae'] != null ? elemento['nome_mae'].replace(/[^\u0020-\u007a]/g, '') : null;
      elemento['nome_pai'] = elemento['nome_pai'] != null ? elemento['nome_pai'].replace(/[^\u0020-\u007a]/g, '') : null;
      elemento['nome_resp'] = elemento['nome_resp'] != null ? elemento['nome_resp'].replace(/[^\u0020-\u007a]/g, '') : null;
      elemento['complemento'] = elemento['complemento'] != null ? elemento['complemento'].replace(/[^\u0020-\u007a]/g, '') : null;
      elemento['loc_no'] = elemento['loc_no'] != null ? elemento['loc_no'].replace(/[^\u0020-\u007a]/g, '') : null;
      elemento['log_no'] = elemento['log_no'] != null ? elemento['log_no'].replace(/[^\u0020-\u007a]/g, '') : null;
      elemento['bai_no'] = elemento['bai_no'] != null ? elemento['bai_no'].replace(/[^\u0020-\u007a]/g, '') : null;
      arrayFinal.push(elemento);
    })
    return arrayFinal;
  }

  public static validarCampos(model: { event: Event }): void {
    if (!(<HTMLInputElement>event.target).validity.valid) {
      (<HTMLInputElement>event.target).classList.add("is-invalid");
    } else {
      (<HTMLInputElement>event.target).classList.remove("is-invalid");
    }
  }

  public static eliminaValoresRepetidos(arrayAlvo: Object[], campo: string): Object[] {
    return Array.from(new Set(arrayAlvo.map(a => a[campo])))
      .map(id => {
        return arrayAlvo.find(a => a[campo] === id)
      })
  }

  public static cypher(entrada: string): CryptoJS.WordArray {
    return CryptoJS.AES.encrypt(entrada, CONSTANTES.CK);
  }

  public static decypher(entrada: string): string {
    return CryptoJS.AES.decrypt(entrada, CONSTANTES.CK).toString(CryptoJS.enc.Utf8);
  }

  public static abreviarNome(nome: string): string {
    const arrayDePalavras = nome.split(' ');
    let stringRetorno = "";
    arrayDePalavras.forEach((palavra: string) => {
      const primeiroCaracter = palavra.charAt(0).toUpperCase();
      stringRetorno += primeiroCaracter;
    })
    return stringRetorno;
  }

  public static abreviarNomeDisciplina(nome: string): string {
    const arrayDePalavras = nome.split(' ');
    let stringRetorno = "";
    if (arrayDePalavras.length == 1) {
      stringRetorno = arrayDePalavras[0].substr(0, 3);
    } else {
      arrayDePalavras.forEach((palavra: string) => {
        const primeiroCaracter = palavra.charAt(0).toUpperCase();
        stringRetorno += primeiroCaracter;
      })
    }



    return stringRetorno;
  }

  public static now(): string {
    let data = new Date();
    return (
      data.getFullYear().toString() +
      "-" +
      ("0" + (data.getMonth() + 1)).slice(-2).toString() +
      "-" +
      ("0" + (data.getDate())).slice(-2).toString() +
      " " +
      data.getHours().toString() +
      ":" +
      data.getMinutes().toString() +
      ":" +
      data.getSeconds().toString()
    );
  }

  public static horaAtual(): string {
    let data = new Date();
    return (
      data.getHours().toString() +
      ":" +
      data.getMinutes().toString() +
      ":" +
      data.getSeconds().toString()
    );
  }

  public static dataAtual(): string {
    let data = new Date();
    return (
      data.getFullYear().toString() +
      "-" +
      ("0" + (data.getMonth() + 1)).slice(-2).toString() +
      "-" +
      ("0" + (data.getDate())).slice(-2).toString()
    );
  }

  public static gravarErroAnalytics(erro: string) {
    //Depois que descobrir como logar exceções, alterar aqui.
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
        rota.response.json["error"] == "token_expired" ||
        rota.response.json["error"] == "token_not_provided"
      ) {
        rota.router.navigate([""]);
        localStorage.setItem("ne_token", "null");
        window.location.reload();
      }
    } catch (error) {
      console.log("Erro");
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
      let str_obj = Utils.decriptAtoB(
        localStorage.getItem("perm"),
        CONSTANTES.PASSO_CRIPT
      );
      return JSON.parse(str_obj);
    } catch (error) {
      return null;
    }
  }

  public static verificarDados(): Object {
    try {
      let str_obj = Utils.decriptAtoB(localStorage.getItem("dados"), CONSTANTES.PASSO_CRIPT);
      return JSON.parse(str_obj);
    } catch (error) {
      return null;
    }
  }

  public static pegarDadosEscopo(): { esc_id, usr_id, epu_id, nome, nivel } {
    try {
      let str_escopo = Utils.decriptAtoB(localStorage.getItem("escopo_perfil"), CONSTANTES.PASSO_CRIPT);
      const objetoRetorno = JSON.parse(str_escopo)[0];
      return { esc_id: objetoRetorno['esc_id'], usr_id: objetoRetorno['usr_id'], epu_id: objetoRetorno['epu_id'], nome: objetoRetorno['nome'], nivel: objetoRetorno['nivel'] }
    } catch (error) {
      return null;
    }
  }



  public static verificarGrupos(): Object {
    try {
      let str_obj = Utils.decriptAtoB(
        localStorage.getItem("grupos"),
        CONSTANTES.PASSO_CRIPT
      );
      return JSON.parse(str_obj);
    } catch (error) {
      return null;
    }
  }

  public static verificarMenus(): Object {
    try {
      let str_obj = Utils.decriptAtoB(
        localStorage.getItem("menus"),
        CONSTANTES.PASSO_CRIPT
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
    if (cnpj == "00000000000000" ||
      cnpj == "11111111111111" ||
      cnpj == "22222222222222" ||
      cnpj == "33333333333333" ||
      cnpj == "44444444444444" ||
      cnpj == "55555555555555" ||
      cnpj == "66666666666666" ||
      cnpj == "77777777777777" ||
      cnpj == "88888888888888" ||
      cnpj == "99999999999999")
      return false;

    // Valida DVs
    let tamanho = cnpj.length - 2
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
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
    let permissoes: Object = Utils.verificarPermissoes();
    for (let key in permissoes) {
      if (permissoes[key]["rota"] == rota) {
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
    email_rede_ensino, responsavel_rede_ensino, telefone_rede_ensino, endereco_rede_ensino, cnpj_rede_ensino, logo_rede_ensino, nome_abreviado
  } {
    return JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados_escola'), CONSTANTES.PASSO_CRIPT))[0];
  }

  public static gerarNomeUnico(): string {
    return Utils.encriptBtoA('_' + Math.random().toString(36).substr(1, 9) + "_" + Date.now().toString(), CONSTANTES.PASSO_CRIPT);
  }

  public static formatarDataPadraoAmericano(dataFormatoBrasileiro: string): string {
    let arrayDataBrasileiro: Array<string> = dataFormatoBrasileiro.split('/');
    let arrayDataAmericano = arrayDataBrasileiro[2] + "-" + arrayDataBrasileiro[1] + "-" + arrayDataBrasileiro[0];
    return arrayDataAmericano;
  }

  public static pegarNomeClasseMetodo(): string {
    const err = (new Error).stack;
    return err;
  }

  public static gerarDigitosCodigoDeBarras(matricula: string, anoAtual: number) {
    const digitos = matricula.length;
    const ano = anoAtual.toString();
    let invertida = "";

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
