import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Ocorrencia } from './ocorrencia.model';
import { Observable } from 'rxjs';
import { CONSTANTES } from '../../shared/constantes.shared';

@Injectable()
export class OcorrenciaService {

  constructor(private http: HttpClient, private router: Router) { }

  public inserir(ocorrencia: Ocorrencia): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "inserir-ocorrencia",
      JSON.stringify({ ocorrencia }),
      headers
    );
  }

  /**
   *
   * @param tod_id Id do tipo de ocorrência
   * @param data_inicio Período inicial
   * @param data_fim Período final
   * @param ordenamento Tipo de ordenamento t para agrupar por turma, d para agrupar de forma decrescente.
   */
  public listarQuantidadeTipoPeriodo(tod_id: number, data_inicio: string, data_fim: string, ordenamento: string): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "listar-quantidade-tipo-periodo",
      JSON.stringify({
        tod_id: tod_id,
        data_inicio: data_inicio,
        data_fim: data_fim,
        ordenamento: ordenamento
      }),
      headers
    );
  }

  public alterarStatusEntregaMensagem(arrayDeOcorrenciasVerificadas: Object[]): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "alterar-status-entrega-mensagem-ocorrencia-disciplinar",
      JSON.stringify({ arrayDeOcorrenciasVerificadas: arrayDeOcorrenciasVerificadas }),
      headers
    );
  }

  public listarQuantidadeAlertaNaoVerificado(
    esc_id: number,
    usr_id: number,
    tod_id: number,
    data_inicio: string,
    data_fim: string,
  ): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "listar-quantidade-alerta-ocorrencia-nao-verificada",
      JSON.stringify({
        esc_id: esc_id,
        usr_id: usr_id,
        tod_id: tod_id,
        data_inicio: data_inicio,
        data_fim: data_fim
      }),
      headers
    );
  }

  public calcularAvaliacaoSocial(
    trm_id: number,
    data_inicio: string,
    data_fim: string,
    valor_total_avaliacao_social: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "calcular-avaliacao-social",
      JSON.stringify({
        trm_id: trm_id,
        data_inicio: data_inicio,
        data_fim: data_fim,
        valor_total_avaliacao_social: valor_total_avaliacao_social
      }),
      headers
    );
  }

  public listarDetalhes(est_id: number, data_inicio: string, data_fim: string): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "listar-detalhes-ocorrencias",
      JSON.stringify({
        est_id: est_id,
        data_inicio: data_inicio,
        data_fim: data_fim
      }),
      headers
    );
  }

  public filtrar(
    valor: string,
    limit: number,
    offset: number,
    esc_id: number
  ): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "filtrar-ocorrencia",
      JSON.stringify({
        valor: valor,
        limit: limit,
        offset: offset,
        esc_id: esc_id
      }),
      headers
    );
  }

}
