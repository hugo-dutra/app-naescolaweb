import { Injectable } from '@angular/core';
import { CONSTANTES } from '../../shared/constantes.shared';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AlertaService {

  constructor(private http: HttpClient) { }

  /**
   * Lista regras de alertas criados para determinada escola.
   * @param esc_id id da escola no qual os alertas foram criados
   */
  public listarRegraAlerta(esc_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(CONSTANTES.HOST_API + 'listar-regra-alerta', JSON.stringify({ esc_id: esc_id }), headers);
  }

  /**
   * Insere uma nova regra de alerta que será, posteriormente,
   * associada a um determinado conjunto de usuários de determinada escola.
   * @param valor_referencia Valor no qual o alerta será acionado.
   * @param opa_id Operador alerta que será usado na comparação.
   * @param tod_id Tipo de ocorrencia disciplinar que será analisada.
   * @param usr_id ID do usuário que será criando o alerta
   * @param esc_id Escola na qual o alerta é válido
   * @param data_criacao Data da criação do alerta
   * @param data_inicio Período inicial no qual será considerado filtro das ocorrencias a serem analizadas
   * @param data_fim Período final no qual será considerado filtro das ocorrencias a serem analizadas.
   */
  public inserirRegraAlerta(
    valor_referencia: number, opa_id: number, tod_id: number,
    usr_id: number, esc_id: number, data_criacao: string,
    data_inicio: string, data_fim: string): Observable<any> {

    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(CONSTANTES.HOST_API + 'inserir-regra-alerta',
      JSON.stringify({
        valor_referencia: valor_referencia, opa_id: opa_id, tod_id: tod_id,
        usr_id: usr_id, esc_id: esc_id, data_criacao: data_criacao,
        data_inicio: data_inicio, data_fim: data_fim,
      }),
      headers);
  }

  /**
   *
   * @param ral_id
   * @param tod_id
   * @param opa_id
   * @param valor_referencia
   * @param data_inicio
   * @param data_fim
   * @param esc_id
   * @param usr_id
   */
  public alterarRegraAlerta(
    ral_id: number, tod_id: number, opa_id: number,
    valor_referencia: number, data_inicio: string, data_fim: string,
    esc_id: number, usr_id: number): Observable<any> {

    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(CONSTANTES.HOST_API + 'alterar-regra-alerta', JSON.stringify(
      {
        ral_id: ral_id, tod_id: tod_id, opa_id: opa_id,
        valor_referencia: valor_referencia, data_inicio: data_inicio, data_fim: data_fim,
        esc_id: esc_id, usr_id: usr_id,
      }),
      headers);
  }


  /**
   * Exclui uma regra de alerta
   * @param ral_id id da regra de alerta que será excluído.
   */
  public excluirRegraAlerta(ral_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(CONSTANTES.HOST_API + 'excluir-regra-alerta',
      JSON.stringify({ ral_id: ral_id }), headers);
  }

  /**
 * Método que envia matriz com alertas na qual o usuário poderá ser informado.
 * @param arrayOfRegraAlertaUsuario Array contando objetos com o stributo ral_id(regra alerta),
 * usr_id(Id do usuario) e esc_id(Id da escola que está fazendo a atribuição do alerta)
 */
  public inserirRegraAlertaUsuario(arrayOfRegraAlertaUsuario: Object[]): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(CONSTANTES.HOST_API + 'inserir-regra-alerta-usuario',
      JSON.stringify({ arrayOfRegraAlertaUsuario: arrayOfRegraAlertaUsuario }), headers);
  }

  /**
   *
   * @param arrayOfRegraAlertaUsuario
   */
  public excluirRegraAlertaUsuario(arrayOfRegraAlertaUsuario: Object[]): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(CONSTANTES.HOST_API + 'excluir-regra-alerta-usuario',
      JSON.stringify({ arrayOfRegraAlertaUsuario: arrayOfRegraAlertaUsuario }), headers);
  }


  /**
   * Lista alertas associados ao usuário e escola informado.
   * @param usr_id Id do usuário cujos alertas associação foi realizada.
   * @param esc_id Id da escola onde o usuário está logado.
   */
  public listarRegraAlertaUsuario(usr_id: number, esc_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(CONSTANTES.HOST_API + 'listar-regra-alerta-usuario',
      JSON.stringify({ usr_id: usr_id, esc_id: esc_id }), headers);
  }

  /**
  * Insere qual ocorrencia já foi verificada por determinado usuário, em determinada
  *  data, e o que foi feito referente aquele alerta.
  * @param est_id Id do estudante para aplicar o filtro e inserir na tabela de alertas de ocorrencias verificadas
  * @param tod_id Id do tipo de ocorrência do alerta
  * @param usr_id Id do usuário que recebeu o alerta
  * @param esc_id Id da escola cujo usuário recebeu o alerta
  * @param data_verificacao Data da verificação do alerta
  * @param data_inicio_considerado Período inicial do filtro para localizar as ocorrências a serem data como tratadas
  * @param data_fim_considerado Período final do filtro para localizar as ocorrências a serem data como tratadas
  * @param observacao Observação registrada no ato da conclusão / Fechamento do alerta de ocorrência
  */
  public inserirAlertaOcorrenciaVerificada(
    est_id: number, tod_id: number, usr_id: number,
    esc_id: number, data_inicio_considerado: string, data_fim_considerado: string,
    oov_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(CONSTANTES.HOST_API + 'inserir-alerta-ocorrencia-verificada',
      JSON.stringify({
        est_id: est_id, tod_id: tod_id, usr_id: usr_id,
        esc_id: esc_id, data_inicio_considerado: data_inicio_considerado, data_fim_considerado: data_fim_considerado,
        oov_id: oov_id,
      }), headers);
  }

  /**
   *
   * @param data_verificacao
   * @param observacao
   */
  public inserirObservacaoAlertaOcorrenciaVerificada(
    data_verificacao: string,
    observacao: string): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(CONSTANTES.HOST_API + 'inserir-observacao-alerta-ocorrencia-verificada',
      JSON.stringify({ observacao: observacao, data_verificacao: data_verificacao }), headers);
  }

  /**
   * Metodo lista os operadores lógicos que definem o critério de ativação dos alertas.
   */
  public listarOperadorAlerta(): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(CONSTANTES.HOST_API + 'listar-operador-alerta', null, headers);
  }

}
