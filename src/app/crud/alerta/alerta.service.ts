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
     * Metodo lista os operadores lógicos que definem o critério de ativação dos alertas.
     */
  public listarOperadorAlerta(): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.get(CONSTANTES.N_HOST_API + 'operador-alerta', headers);
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
    usr_id: number, esc_id: number, data_criacao: Date,
    data_inicio: Date, data_fim: Date): Observable<any> {

    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(CONSTANTES.N_HOST_API + 'regra-alerta', { valor_referencia, opa_id, tod_id, usr_id, esc_id, data_criacao, data_inicio, data_fim }, headers);
  }

  /**
     * Lista regras de alertas criados para determinada escola.
     * @param esc_id id da escola no qual os alertas foram criados
     */
  public listarRegraAlerta(esc_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.get(CONSTANTES.N_HOST_API + `regra-alerta/${esc_id}`, headers);
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
    id: number, tod_id: number, opa_id: number,
    valor_referencia: number, data_inicio: Date, data_fim: Date, data_criacao: Date,
    esc_id: number, usr_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.patch(CONSTANTES.N_HOST_API + 'regra-alerta', { id, tod_id, opa_id, valor_referencia, data_inicio, data_fim, data_criacao, esc_id, usr_id, }, headers);
  }


  /**
   * Exclui uma regra de alerta
   * @param ral_id id da regra de alerta que será excluído.
   */
  public excluirRegraAlerta(id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')), body: { id: id }
    };
    return this.http.delete(CONSTANTES.N_HOST_API + 'regra-alerta', headers);
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
    return this.http.post(CONSTANTES.N_HOST_API + 'regra-alerta-usuario', arrayOfRegraAlertaUsuario, headers);
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
    return this.http.get(CONSTANTES.N_HOST_API + `regra-alerta-usuario/${usr_id}/${esc_id}`, headers);
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
    return this.http.post(CONSTANTES.N_HOST_API + 'regra-alerta-usuario/excluir', arrayOfRegraAlertaUsuario, headers);
  }

  /**
     *
     * @param data_verificacao
     * @param observacao
     */
  public inserirObservacaoAlertaOcorrenciaVerificada(data_verificacao: string, observacao: string): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(CONSTANTES.N_HOST_API + 'observacao-alerta-ocorrencia-verificada', { observacao, data_verificacao }, headers);
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
    return this.http.post(CONSTANTES.N_HOST_API + 'alerta-ocorrencia-verificada', { est_id, tod_id, usr_id, esc_id, data_inicio_considerado, data_fim_considerado, oov_id }, headers);
  }

}
