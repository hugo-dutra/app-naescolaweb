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
    return this.http.post(
      CONSTANTES.HOST_API + 'inserir-portaria',
      JSON.stringify({ portaria: portaria }),
      headers);
  }

  public listar(esc_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "portarias",
      JSON.stringify({ esc_id: esc_id }),
      headers
    );
  }

  /**
   *
   * @param trm_id Id da turma on de se deseja saber a presença dos estudantes
   * @param data Data desejada
   * @param tipo_movimentacao Tipo demovimentação. 0 para entrada e 1 para saída.
   */
  public listarPresentes(trm_id: number, data: string, tipo_movimentacao: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "listar-presentes-turma-data-movimentacao",
      JSON.stringify({ trm_id: trm_id, data: data, tipo_movimentacao: tipo_movimentacao }),
      headers
    );
  }

  public verificarFrequenciaEstudanteAnoLetivo(est_id: number, ano_letivo: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "verificar-percentual-frequencia-portaria-estudante",
      JSON.stringify({ est_id: est_id, ano_letivo: ano_letivo }),
      headers
    );
  }

  public verificarFrequenciaTurmaAnoLetivo(trm_id: number, ano_letivo: number, tipo_movimentacao: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "verificar-percentual-frequencia-portaria-turma",
      JSON.stringify({ trm_id: trm_id, ano_letivo: ano_letivo, tipo_movimentacao: tipo_movimentacao }),
      headers
    );
  }

  /**
   * Método retorna quantidade de estudantes em cada dia durante o intervalo informado
   * @param data_inicio Periodo inicial
   * @param data_fim Periodo final
   * @param tipo_movimentacao tipo de movimentacao
   */
  public listarFrequenciaPortariaPeriodo(data_inicio: string, data_fim: string, tipo_movimentacao: number, esc_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "listar-frequencia-portaria-periodo",
      JSON.stringify({ data_inicio: data_inicio, data_fim: data_fim, tipo_movimentacao: tipo_movimentacao, esc_id: esc_id }),
      headers
    );
  }

  /**
   *
   * @param {number} est_id
   * @returns {Observable<any>}
   * @memberof PortariaService
   */
  public listarHistoricoEntradaSaidaEstudante(est_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "listar-historico-entrada-saida-estudante-portaria",
      JSON.stringify({ est_id: est_id }),
      headers
    );
  }

  /**
   *
   * @param esc_id  Recupera o registro mais recente de passagem da portaria, subtraindo 3 dias desse valor.
   */
  public verificarPassagemMaisRecente(esc_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "verificar-passagem-recente-escola",
      JSON.stringify({ esc_id: esc_id }),
      headers
    );
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
    return this.http.post(
      CONSTANTES.HOST_API + "verificar-absenteismo-total-turma",
      JSON.stringify({ trm_id: trm_id, esc_id: esc_id, data_inicio: data_inicio, data_fim: data_fim, limite: limite }),
      headers
    );
  }

  public alterar(portaria: Portaria): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "alterar-portaria",
      JSON.stringify({ portaria: portaria }),
      headers
    );
  }

  public excluir(por_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "excluir-portaria",
      JSON.stringify({ por_id: por_id }),
      headers
    );
  }

  //########################## CRONOGRAMA PORTARIA ##########################//
  public inserirCronogramaPortaria(cronogramaPortaria: CronogramaPortaria): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + 'inserir-cronograma-portaria',
      JSON.stringify({ cronogramaPortaria: cronogramaPortaria }),
      headers);
  }

  public excluirCronogramaPortaria(crp_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + 'excluir-cronograma-portaria',
      JSON.stringify({ crp_id: crp_id }),
      headers);
  }

  public listarCronogramaPortaria(por_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + 'listar-cronograma-portaria',
      JSON.stringify({ por_id: por_id }),
      headers);
  }

  //########################## FREQUENCIA DA PORTARIA ##########################//
  public inserirEntradas(por_id: number, entradas: Object[]): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + 'inserir-frequencia-entrada-portaria',
      JSON.stringify({ por_id: por_id, entradas: entradas }),
      headers);
  }

  public inserirSaidas(por_id: number, saidas: Object[]): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + 'inserir-frequencia-saida-portaria',
      JSON.stringify({ por_id: por_id, saidas: saidas }),
      headers);
  }

  //########################## OCORRÊNCIAS DISCIPLINARES DA PORTARIA ##########################//
  public inserirAtrasos(usr_id: number, esc_id: number, atrasos: Object[]): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + 'inserir-atraso-portaria',
      JSON.stringify({ usr_id: usr_id, esc_id: esc_id, atrasos: atrasos }),
      headers);
  }

  public inserirSemUniforme(usr_id: number, esc_id: number, semUniforme: Object[]): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + 'inserir-sem-uniforme-portaria',
      JSON.stringify({ usr_id: usr_id, esc_id: esc_id, semUniforme: semUniforme }),
      headers);
  }

}
