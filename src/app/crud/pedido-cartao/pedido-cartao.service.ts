import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONSTANTES } from '../../shared/constantes.shared';
import { PedidoCartao } from './pedido-cartao.model';

@Injectable()
export class PedidoCartaoService {

  constructor(private http: HttpClient) { }

  public listarModeloCartao(): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "modelos-cartao",
      null,
      headers
    );
  }

  public inserir(pedidoCartao: PedidoCartao): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "inserir-pedido-cartao",
      JSON.stringify({ pedidoCartao }),
      headers
    );
  }

  public cancelar(pec_id: number, usr_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "cancelar-pedido-cartao",
      JSON.stringify({ pec_id: pec_id, usr_id: usr_id }),
      headers
    );
  }

  public alterarStatusPedidoEntidade(
    pec_id: number,
    usr_id: number,
    cod_status: number
  ): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "alterar-status-pedido-entidade",
      JSON.stringify({
        pec_id: pec_id,
        usr_id: usr_id,
        cod_status: cod_status
      }),
      headers
    );
  }

  public alterarStatusPendencia(
    id: number,
    status: number
  ): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "alterar-status-pendencia-pedido-cartao",
      JSON.stringify({
        id: id,
        status: status
      }),
      headers
    );
  }

  public listarPeriodoEscId(
    data_inicio: string,
    data_fim: string,
    esc_id: number
  ): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "listar-pedido-cartao-periodo",
      JSON.stringify({
        data_inicio: data_inicio,
        data_fim: data_fim,
        esc_id: esc_id
      }),
      headers
    );
  }

  public listarPedidoUsuarioEntidade(
    usr_id: number,
    data_inicio: string,
    data_fim: string
  ): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "lista-pedido-usuario-entidade",
      JSON.stringify({
        usr_id: usr_id,
        data_inicio: data_inicio,
        data_fim: data_fim
      }),
      headers
    );
  }

  public detalharPecId(pec_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "detalhar-pedido-cartao",
      JSON.stringify({ pec_id: pec_id }),
      headers
    );
  }

  public gerarPlanilhaEntidade(arrayOfPedidos: Object[]): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "gerar-planilha-pedido-cartao",
      JSON.stringify({ arrayOfPedidos: arrayOfPedidos }),
      headers
    );
  }

  public inserirPendencia(
    descricao: string,
    est_id: number,
    usr_id: number,
    pec_id: number
  ): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "inserir-pendencia-pedido-cartao",
      JSON.stringify({ descricao: descricao, est_id: est_id, usr_id: usr_id, pec_id: pec_id }),
      headers
    );
  }

  public listarPendencia(
    data_inicio: string,
    data_fim: string,
    usr_id: number
  ): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "listar-pendencia-pedido-cartao",
      JSON.stringify({ data_inicio: data_inicio, data_fim: data_fim, usr_id: usr_id }),
      headers
    );
  }

  public filtrarPedidoNomeEstudante(nome: string, esc_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "filtrar-nome-pedido-cartao",
      JSON.stringify({ nome: nome, esc_id: esc_id }),
      headers
    );
  }

}
