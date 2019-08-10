import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONSTANTES } from '../../shared/constantes.shared';

@Injectable()
export class DisciplinarService {

  constructor(private http: HttpClient) { }

  public listarGraficoQuantitativoPeriodo(
    esc_id: number,
    data_inicio: string,
    data_fim: string
  ): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "listar-grafico-quantidade-periodo",
      JSON.stringify({
        esc_id: esc_id,
        data_inicio: data_inicio,
        data_fim: data_fim
      }),
      headers
    );
  }

  public listarGraficoQuantitativoTurmaPeriodo(
    esc_id: number,
    data_inicio: string,
    data_fim: string
  ): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "listar-grafico-quantidade-turma-periodo",
      JSON.stringify({
        esc_id: esc_id,
        data_inicio: data_inicio,
        data_fim: data_fim
      }),
      headers
    );
  }

  /**
   * Lista as quantidade de determinado
   * tipo de ocorrencia de cada estudante
   * para a turma informada no período informado
   *
   * @param prl_id Id do período letivo
   * @param trm_id Id ta turma
   */
  public listarGraficoQuantitativoTipoPeriodo(
    prl_id: number,
    trm_id: number
  ): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "listar-grafico-quantidade-tipo-periodo",
      JSON.stringify({
        prl_id: prl_id,
        trm_id: trm_id
      }),
      headers
    );
  }

  public listarGraficoQuantitativoEstudantePeriodo(
    trm_id: number,
    data_inicio: string,
    data_fim: string
  ): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "listar-grafico-quantidade-estudante-periodo",
      JSON.stringify({
        trm_id: trm_id,
        data_inicio: data_inicio,
        data_fim: data_fim
      }),
      headers
    );
  }

  public listarGraficoQuantitativoTipoOcorrenciaPeriodo(
    esc_id: number,
    data_inicio: string,
    data_fim: string
  ): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "listar-grafico-quantidade-tipo-ocorrencia-periodo",
      JSON.stringify({
        esc_id: esc_id,
        data_inicio: data_inicio,
        data_fim: data_fim
      }),
      headers
    );
  }
}
