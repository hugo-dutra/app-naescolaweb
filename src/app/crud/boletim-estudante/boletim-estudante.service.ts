import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONSTANTES } from '../../shared/constantes.shared';
import { ResultadoBoletim } from './resultado-boletim.model';

@Injectable()
export class BoletimEstudanteService {

  constructor(private http: HttpClient) { }

  /**
   *Array com ids de estudante (est_id) e o ano letivo na qual os diários deverão ser criados.
   * @param {number[]} arrayOfEstudantes
   * @param {number} ano_letivo
   * @returns {Observable<any>}
   * @memberof BoletimEstudanteService
   */
  public inserirBoletimEscolar(arrayOfEstudantes: Object[], ano_letivo: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "inserir-boletim-estudante",
      JSON.stringify({
        arrayOfEstudantes: arrayOfEstudantes,
        ano_letivo: ano_letivo
      }),
      headers
    );
  }

  /**
   *Método consolida as notas do diário informada, para um certo período letivo, como média ou somatório
   * @param {number} media_somatorio: 0: Calcula a média ponderada. 1: Calcula a soma das avaliações
   * @param {number} prl_id: Id do período letivo desejada para a consolidação das notas
   * @param {number} dip_id: Diário onde estão as notas a serem consolidadas.
   * @returns {Observable<any>}
   * @memberof BoletimEstudanteService
   */
  public consolidarNotasBoletimEscolar(media_somatorio: number, prl_id: number, dip_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "consolidar-notas-estudante",
      JSON.stringify({
        media_somatorio: media_somatorio,
        prl_id: prl_id,
        dip_id: dip_id
      }),
      headers
    );
  }

  /**
   *Recebe um array de boletins e envia esse array para a API inserir os dados no banco.
   * @param {ResultadoBoletim[]} resultadosBoletins
   * @returns {Observable<any>}
   * @memberof BoletimEstudanteService
   */
  public inserirResultadoBoletim(resultadosBoletins: ResultadoBoletim[]): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "inserir-resultado-boletim-estudante",
      JSON.stringify({
        resultadosBoletins: resultadosBoletins
      }),
      headers
    );
  }

  public listarFaltasTurmaGeralBoletim(esc_id: number, trm_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "listar-faltas-turma-geral-boletim",
      JSON.stringify({ esc_id: esc_id, trm_id: trm_id }),
      headers
    );
  }

}
