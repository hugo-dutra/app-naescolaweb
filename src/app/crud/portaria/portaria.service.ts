import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Portaria } from './portaria.model';
import { Observable } from 'rxjs';
import { CONSTANTES } from '../../shared/constantes.shared';
import { CronogramaPortaria } from './cronograma-portaria.model';

@Injectable()
export class PortariaService {

  constructor(private http: HttpClient) { }


  //########################## PORTARIA ##########################//
  public inserir(portaria: Portaria): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(CONSTANTES.N_HOST_API + 'portaria', portaria, headers);
  }

  public listar(esc_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.get(CONSTANTES.N_HOST_API + `portaria/${esc_id}`, headers);
  }

  public alterar(portaria: Portaria): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.patch(CONSTANTES.N_HOST_API + 'portaria', portaria, headers);
  }

  /**
     * @param trm_id Id da turma on de se deseja saber a presença dos estudantes
     * @param data Data desejada
     * @param tipo_movimentacao Tipo demovimentação. 0 para entrada e 1 para saída.
     */
  public listarPresentes(trm_id: number, data: string, tipo_movimentacao: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.get(CONSTANTES.N_HOST_API + `frequencia-portaria/presentes-turma-data-movimentacao/${trm_id}/${data}/${tipo_movimentacao}`, headers);
  }


  public verificarFrequenciaTurmaAnoLetivo(trm_id: number, ano_letivo: number, tipo_movimentacao: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.get(CONSTANTES.N_HOST_API + `frequencia-portaria/verificar-percentual-turma/${trm_id}/${ano_letivo}/${tipo_movimentacao}`, headers);
  }

  /**
   * Método retorna quantidade de estudantes em cada dia durante o intervalo informado
   * @param data_inicio Periodo inicial
   * @param data_fim Periodo final
   * @param tipo_movimentacao tipo de movimentacao
   */
  public listarFrequenciaPortariaPeriodo(data_inicio: string, data_fim: string, tipo_movimentacao: number, esc_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.get(CONSTANTES.N_HOST_API + `frequencia-portaria/listar-frequencia-periodo/${data_inicio}/${data_fim}/${tipo_movimentacao}/${esc_id}`, headers);
  }

  /**
    *
    * @param {number} est_id
    * @returns {Observable<any>}
    * @memberof PortariaService
    */
  public listarHistoricoEntradaSaidaEstudante(est_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.get(CONSTANTES.N_HOST_API + `frequencia-portaria/historico-entrada-saida/${est_id}`, headers);
  }

  /**
     *
     * @param esc_id  Recupera o registro mais recente de passagem da portaria, subtraindo 3 dias desse valor.
     */
  public verificarPassagemMaisRecente(esc_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.get(CONSTANTES.N_HOST_API + `frequencia-portaria/verificar-passagem-recente/${esc_id}`, headers);
  }

  /**
     *
     * @param trm_id se o id da turma for zero, a pesquisa ocorrerá em toda a escola, caso contrário procurará pelo código da turma informado
     * @param esc_id Código da escola
     * @param data_inicio período inicial da consulta
     * @param data_fim período final da consulta
     */
  public verificarAbsenteismoTotalPorTurma(trm_id: number, esc_id: number, data_inicio: string, data_fim: string, limite: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.get(CONSTANTES.N_HOST_API + `frequencia-portaria/absenteismo-total-turma/${trm_id}/${esc_id}/${data_inicio}/${data_fim}/${limite}`, headers);
  }

  public excluir(por_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")), body: { por_id } }
    return this.http.delete(CONSTANTES.N_HOST_API + 'portaria', headers);
  }

  //########################## CRONOGRAMA PORTARIA ##########################//

  public inserirCronogramaPortaria(cronogramaPortaria: CronogramaPortaria): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(CONSTANTES.N_HOST_API + 'cronograma-portaria', cronogramaPortaria, headers);
  }

  public listarCronogramaPortaria(por_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.get(CONSTANTES.N_HOST_API + `cronograma-portaria/${por_id}`, headers);
  }

  public excluirCronogramaPortaria(crp_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")), body: { crp_id } }
    return this.http.delete(CONSTANTES.N_HOST_API + 'cronograma-portaria', headers);
  }

  //########################## FREQUENCIA DA PORTARIA ##########################//

  public inserirEntradas(por_id: number, entradas: Object[]): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(CONSTANTES.N_HOST_API + 'frequencia-portaria/entradas', { por_id, entradas }, headers);
  }

  public inserirSaidas(por_id: number, saidas: Object[]): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(CONSTANTES.N_HOST_API + 'frequencia-portaria/saidas', { por_id, saidas }, headers);
  }

  //########################## OCORRÊNCIAS DISCIPLINARES DA PORTARIA ##########################//

  public inserirAtrasos(usr_id: number, esc_id: number, atrasos: Object[]): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(CONSTANTES.N_HOST_API + 'ocorrencia-disciplinar/inserir-atraso-da-portaria', { usr_id, esc_id, atrasos }, headers);
  }

  public inserirSemUniforme(usr_id: number, esc_id: number, semUniforme: Object[]): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(CONSTANTES.N_HOST_API + 'ocorrencia-disciplinar/inserir-sem-uniforme-da-portaria', { usr_id, esc_id, semUniforme }, headers);
  }


  public inserirEntradasDoAplicativo(por_id: number, entradas: Object[]): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(CONSTANTES.N_HOST_API + 'frequencia-portaria/inserir-do-aplicativo', { por_id, entradas }, headers);
  }


  public alterarStatusEntregaMensagem(arrayPassagensPortaria: Object[]): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.patch(CONSTANTES.N_HOST_API + `frequencia-portaria/status-entrega-mensagem-entrada-saida`, arrayPassagensPortaria, headers);
  }

}
