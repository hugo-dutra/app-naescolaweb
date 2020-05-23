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
    return this.http.post(CONSTANTES.N_HOST_API + "turma", turmas, headers);
  }

  public listar(
    limit: number, offset: number,
    asc: boolean, esc_id: number
  ): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.get(CONSTANTES.N_HOST_API + `turma/${limit}/${offset}/${asc}/${esc_id}`, headers);
  }

  public alterar(turma: Turma): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.patch(CONSTANTES.N_HOST_API + "turma", turma, headers);
  }


  public excluir(id: number): Observable<any> {
    const headers =
    {
      headers: new HttpHeaders()
        .append("Content-type", "application/json")
        .append("Authorization", localStorage.getItem("token")), body: { id: id }
    }
    return this.http.delete(CONSTANTES.N_HOST_API + "turma", headers);
  }


  public listarTurnoId(
    trn_id: number,
    esc_id: number,
    ano: number
  ): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.get(CONSTANTES.N_HOST_API + `turma/${trn_id}/${esc_id}/${ano}`, headers);
  }


  // Fazer após terminar cadastro de estudantes, importação e enturmação
  public listarTodasAno(
    ano: number,
    esc_id: number
  ): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "turmas-completo-ano-esc",
      JSON.stringify({ ano: ano, esc_id: esc_id }), headers);
  }

  public filtrar(
    valor: string,
    limit: number,
    offset: number,
    esc_id: number
  ): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.get(CONSTANTES.N_HOST_API + `turma/filtrar/${valor}/${limit}/${offset}/${esc_id}`, headers);
  }

  public listarTodas(): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.get(CONSTANTES.N_HOST_API + "turma/todas", headers);
  }

  public integracaoInserir(turmas: Turma[], esc_id: number, ano: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(CONSTANTES.N_HOST_API + "turma/integracao", { turmas: turmas, esc_id: esc_id, ano: ano }, headers);
  }
}
