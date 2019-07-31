import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { CONSTANTES } from '../../shared/constantes.shared';
import { Observable } from 'rxjs';

@Injectable()
export class RendimentoService {

  constructor(private http: HttpClient) { }

  public listarRendimentoTurmaPeriodo(trm_id: number, prl_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "listar-rendimento-turma-periodo",
      JSON.stringify({ trm_id: trm_id, prl_id: prl_id }),
      headers
    );
  }

  public listarRendimentoFaltasEstudantePeriodo(est_id: number, prl_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "listar-rendimento-faltas-estudante-periodo",
      JSON.stringify({ est_id: est_id, prl_id: prl_id }),
      headers);
  }

  public listarRendimentoAreaConhecimentoTurmaPeriodo(trm_id: number, prl_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "listar-rendimento-area-conhecimento-turma-periodo",
      JSON.stringify({ trm_id: trm_id, prl_id: prl_id }),
      headers);
  }

  /**
     * Lista a quantidade de estudante que foram aprovados ou em recuperação dependendo do parametro.
     * @param trm_id id da turma
     * @param nota_corte nota de corte
     * @param prl_id periodo letivo desejado
     * @param tipo_resultado tipo de resultado. 'a' para estudantes com media superior ao corte, e 'r' para retudantes abaixo da nota de corte
     */
  public listarAproveitamentoDisciplinaTurmaPeriodo(trm_id: number, nota_corte: number, prl_id: number, tipo_resultado: string): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "listar-aproveitamento-disciplina-turma-periodo",
      JSON.stringify({
        trm_id: trm_id,
        nota_corte: nota_corte,
        prl_id: prl_id,
        tipo_resultado: tipo_resultado
      }),
      headers
    );
  }

  /**
   * Traz a estatistica de quantos estudante, em cada turma do professor informado, estão abaixo ou acima do valor estabelecido por corte, no marametro tio resultado
   * @param nota_corte Nota de corte para resultado desejado
   * @param prd_id Id do professor / disciplina lecionada
   * @param prl_id Periodo letivo da informação desejada.
   * @param tipo_resultado Se resultado desejado sao aprovados, informar valor 'a', se estudantes com media inferior a nota de corte, informar 'r'
   */
  public listarAproveitamentoProfessorDisciplinaPeriodo(nota_corte: number, prd_id: number, prl_id: number, tipo_resultado: string): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "listar-aproveitamento-professor-disciplina-periodo",
      JSON.stringify({
        nota_corte: nota_corte,
        prd_id: prd_id,
        prl_id: prl_id,
        tipo_resultado: tipo_resultado
      }),
      headers
    );
  }
}
