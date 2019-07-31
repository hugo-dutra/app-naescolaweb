import { Injectable } from '@angular/core';
import { Turma } from './turma.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONSTANTES } from '../../shared/constantes.shared';

@Injectable()
export class TurmaService {

  public turma = new Turma();
  constructor(private http: HttpClient) { }

  public inserir(turmas: Turma[]): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "inserir-turma",
      JSON.stringify({ turmas: turmas }),
      headers
    );
  }

  public alterar(turma: Turma): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "alterar-turma",
      JSON.stringify(turma),
      headers
    );
  }

  public listar(
    limit: number,
    offset: number,
    asc: boolean,
    esc_id: number
  ): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "turmas",
      JSON.stringify({
        limit: limit,
        offset: offset,
        asc: asc,
        esc_id: esc_id
      }),
      headers
    );
  }

  public listarTurnoId(
    trn_id: number,
    esc_id: number,
    ano: number
  ): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "turmas-turno-id",
      JSON.stringify({
        trn_id: trn_id,
        esc_id: esc_id,
        ano: ano
      }),
      headers
    );
  }

  public listarTodasAno(
    ano: number,
    esc_id: number
  ): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "turmas-completo-ano-esc",
      JSON.stringify({
        ano: ano,
        esc_id: esc_id
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
      CONSTANTES.HOST_API + "filtrar-turma",
      JSON.stringify({
        valor: valor,
        limit: limit,
        offset: offset,
        esc_id: esc_id
      }),
      headers
    );
  }

  public listarTodas(): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "turmas-completo",
      null,
      headers
    );
  }

  public excluir(id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "excluir-turma",
      JSON.stringify({ id: id }),
      headers
    );
  }
}
