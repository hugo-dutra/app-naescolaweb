import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Ocorrencia } from './ocorrencia.model';
import { Observable } from 'rxjs';
import { CONSTANTES } from '../../shared/constantes.shared';

@Injectable()
export class OcorrenciaService {

  constructor(private http: HttpClient, private router: Router) { }

  /**
   * Insere nova ocorrência a partir do sistema.
   * @param ocorrencia
   */
  public inserir(ocorrencia: Ocorrencia): Observable<any> {
    console.log(ocorrencia);
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(CONSTANTES.N_HOST_API + 'ocorrencia-disciplinar', ocorrencia, headers);
  }

  /**
     * @param tod_id Id do tipo de ocorrência
     * @param data_inicio Período inicial
     * @param data_fim Período final
     * @param ordenamento Tipo de ordenamento t para agrupar por turma, d para agrupar de forma decrescente.
     */
  public listarQuantidadeTipoPeriodo(tod_id: number, data_inicio: string, data_fim: string, ordenamento: string): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.get(CONSTANTES.N_HOST_API + `ocorrencia-disciplinar/listar-quantidade-tipo-periodo/${tod_id}/${data_inicio}/${data_fim}/${ordenamento}`, headers);
    //return this.http.post(CONSTANTES.HOST_API + "listar-quantidade-tipo-periodo", JSON.stringify({ tod_id: tod_id, data_inicio: data_inicio, data_fim: data_fim, ordenamento: ordenamento }), headers);
  }

  /**
   * Ocorrencias advindas do aplicativo
   * @param ocorrencias
   */
  public inserirDoAplicativo(ocorrencias: Object): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(CONSTANTES.N_HOST_API + 'ocorrencia-disciplinar/inserir-aplicativo-administrativo', ocorrencias, headers);
  }

  public listarDetalhes(est_id: number, data_inicio: string, data_fim: string): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.get(CONSTANTES.N_HOST_API + `ocorrencia-disciplinar/listar-detalhes/${est_id}/${data_inicio}/${data_fim}`, headers);
  }

  public filtrar(
    valor: string, limit: number,
    offset: number, esc_id: number
  ): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.get(CONSTANTES.N_HOST_API + `ocorrencia-disciplinar/filtrar-ocorrencia/${valor}/${limit}/${offset}/${esc_id}`, headers);
  }

  public calcularAvaliacaoSocial(
    trm_id: number, data_inicio: string,
    data_fim: string, valor_total_avaliacao_social: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.get(CONSTANTES.N_HOST_API + `ocorrencia-disciplinar/calcular-avaliacao-social/${trm_id}/${data_inicio}/${data_fim}/${valor_total_avaliacao_social}`, headers);
  }

  public listarQuantidadeAlertaNaoVerificado(
    esc_id: number, usr_id: number, tod_id: number,
    data_inicio: Date, data_fim: Date,
  ): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.get(CONSTANTES.N_HOST_API + `ocorrencia-disciplinar/listar-quantidade-alerta-nao-verificada/${esc_id}/${usr_id}/${tod_id}/${data_inicio}/${data_fim}`, headers);
  }


  //*******************************************************************************************************************/
  //*******************************************************************************************************************/
  //*******************************************************************************************************************/


  public alterarStatusEntregaMensagem(arrayDeOcorrenciasVerificadas: Object[]): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    //return this.http.post(CONSTANTES.N_HOST_API + 'ocorrencia-disciplinar/alterar-status-entrega-mensagem', arrayDeOcorrenciasVerificadas, headers);
    return this.http.post(CONSTANTES.HOST_API + "alterar-status-entrega-mensagem-ocorrencia-disciplinar", JSON.stringify({ arrayDeOcorrenciasVerificadas: arrayDeOcorrenciasVerificadas }), headers);
  }



}
