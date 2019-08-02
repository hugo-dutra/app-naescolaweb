
/**
 * Classe para objeto com parametros importantes para geração do boleto
 *
 * @export
 * @class Cobranca
 */
export class Cobranca {
  /**
   *
   *
   * @type {number}
   * @memberof Cobranca
   */
  discountDays: number;

  /**
   *
   *
   * @type {number}
   * @memberof Cobranca
   */
  discountAmount: number;

  /**
   *Token de segurança associado a operação da geração do boleto
   *
   * @type {string}
   * @memberof Cobranca
   */
  token: string;
  /**
   *Descrição especificando o que o boleto está pagando. Informação que auxiliará o usuário.
   *
   * @type {string}
   * @memberof Cobranca
   */
  description: string;
  /**
   *Valor do boleto
   *
   * @type {number}
   * @memberof Cobranca
   */
  amount: number;
  /**
   *Nome do pagador (Escola, rede de ensino, etc...)
   *
   * @type {string}
   * @memberof Cobranca
   */
  payerName: string;
  /**
   *CPF ou CNPJ do pagado (Escola ou rede de ensino)
   *
   * @type {string}
   * @memberof Cobranca
   */
  payerCpfCnpj: string;
  /**
   *Email para onde será enviada uma notificação referente ao boleto gerado
   *
   * @type {string}
   * @memberof Cobranca
   */
  payerEmail: string;
  /**
   *Campo que informa se o pagador deverá ou não ser notificado quando o referido boleto for gerado.
   *
   * @type {boolean}
   * @memberof Cobranca
   */
  notifyPayer: boolean;
  /**
   *Quantidade de dias após o vencimento que o boleto deverá ser aceito.
   *
   * @type {number}
   * @memberof Cobranca
   */
  maxOverdueDays: number;
  /**
   *Data de vencimento do boleto. Se o campo estiver ausente, o vencimento será de 3 dias após a sua geração.
   *
   * @type {string}
   * @memberof Cobranca
   */
  dueDate: string;

}