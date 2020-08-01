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
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.post(CONSTANTES.N_HOST_API + 'boletim-escolar/inserir', { arrayOfEstudantes, ano_letivo }, headers,);
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
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.get(CONSTANTES.N_HOST_API + `avaliacao-estudante/consolidar-notas/${media_somatorio}/${prl_id}/${dip_id}`, headers,);
  }

  /**
   *Recebe um array de boletins e envia esse array para a API inserir os dados no banco.
   * @param {ResultadoBoletim[]} resultadosBoletins
   * @returns {Observable<any>}
   * @memberof BoletimEstudanteService
   */
  public inserirResultadoBoletim(resultadosBoletins: ResultadoBoletim[]): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.post(CONSTANTES.N_HOST_API + 'resultado-boletim', resultadosBoletins, headers);
  }

  /**
   * Método lista o estudantes destaque em ordem alfabética.
   *
   * @param prl_id Período letivo
   * @param nota_corte Nota a partir da qual o estudante será destaque
   * @param esc_id Escola
   * @param quantidade_dsp Quantidade de disciplinas que o estudante deve possuir nota superior a nota de corte
   * @param ree_id Região onde de encontra a escola. Para filtros de alunos destaque por regional
   */
  public listarEstudantesDestaque(prl_id: number, nota_corte: number, esc_id: number,
    quantidade_dsp: number, ree_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.get(CONSTANTES.N_HOST_API + `resultado-boletim/estudantes-destaque/${prl_id}/${nota_corte}/${esc_id}/${quantidade_dsp}/${ree_id}`, headers);
  }

  public listarFaltasTurmaGeralBoletim(esc_id: number, trm_id: number, minimo_faltas: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')) };
    return this.http.get(CONSTANTES.N_HOST_API + `resultado-boletim/listar-infrequentes/${esc_id}/${trm_id}/${minimo_faltas}`, headers);
  }

}
