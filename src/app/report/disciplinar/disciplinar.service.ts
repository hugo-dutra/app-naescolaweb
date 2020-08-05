import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONSTANTES } from '../../shared/constantes.shared';

@Injectable()
export class DisciplinarService {

  constructor(private http: HttpClient) { }

  public listarGraficoQuantitativoPeriodo(esc_id: number, data_inicio: string, data_fim: string): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.get(CONSTANTES.N_HOST_API + `ocorrencia-disciplinar/grafico-quantidade-periodo/${esc_id}/${data_inicio}/${data_fim}`, headers);
  }

  public listarGraficoQuantitativoTurmaPeriodo(esc_id: number, data_inicio: string, data_fim: string): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.get(CONSTANTES.N_HOST_API + `ocorrencia-disciplinar/grafico-quantidade-turma-periodo/${esc_id}/${data_inicio}/${data_fim}`, headers);
  }

  public listarGraficoQuantitativoEstudantePeriodo(trm_id: number, data_inicio: string, data_fim: string): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.get(CONSTANTES.N_HOST_API + `ocorrencia-disciplinar/grafico-quantidade-estudante-periodo/${trm_id}/${data_inicio}/${data_fim}`, headers);
  }

  public listarGraficoQuantitativoTipoOcorrenciaPeriodo(esc_id: number, data_inicio: string, data_fim: string): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.get(CONSTANTES.N_HOST_API + `ocorrencia-disciplinar/grafico-quantidade-tipo-ocorrencia-periodo/${esc_id}/${data_inicio}/${data_fim}`, headers);
  }

  public listarGraficoQuantitativoTipoPeriodo(prl_id: number, trm_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.get(CONSTANTES.N_HOST_API + `ocorrencia-disciplinar/grafico-quantidade-periodo-letivo-turma/${prl_id}/${trm_id}`, headers);
  }








}
