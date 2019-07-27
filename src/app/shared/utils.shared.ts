import { Router } from "@angular/router";
import { CONSTANTES } from "./constantes.shared";

/**
 *Classe com métodos que serão usados em muitas classes
 *
 * @export
 * @class Utils
 */
export class Utils {

  public static validarCampos(model: { event: Event }): void {
    if (!(<HTMLInputElement>event.target).validity.valid) {
      (<HTMLInputElement>event.target).classList.add("is-invalid");
    } else {
      (<HTMLInputElement>event.target).classList.remove("is-invalid");
    }
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

  public static tratarErro(rota: { router: Router; response: Response }): void {
    try {
      if (
        rota.response.json()["error"] == "token_expired" ||
        rota.response.json()["error"] == "token_not_provided"
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
    for (let i = 0; i < profundidade; i++) {
      retorno = btoa(unescape(encodeURIComponent(retorno)));
    }
    return retorno;
  }

  public static decriptAtoB(string: string, profundidade: number): string {
    let retorno = string;
    for (let i = 0; i < profundidade; i++) {
      retorno = decodeURIComponent(escape(window.atob(retorno)));
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
    return invertida;
  }
}
