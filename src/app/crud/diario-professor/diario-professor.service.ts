import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONSTANTES } from '../../shared/constantes.shared';

@Injectable()
export class DiarioProfessorService {

  constructor(private http: HttpClient) { }

  public listarProfessorHabilitado(esc_id: number, limit: number, offset: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.get(CONSTANTES.N_HOST_API + `diario-professor/listar-habilitado/${esc_id}/${limit}/${offset}`, headers);
  }

  public filtrarProfessorHabilitado(esc_id: number, limit: number, offset: number, valor_filtro: string): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.get(CONSTANTES.N_HOST_API + `diario-professor/filtrar-habilitado/${esc_id}/${limit}/${offset}/${valor_filtro}`, headers);
  }

  public inserir(prd_id: number, arrayOfTurmas: Array<number>, nomesDiarios: Array<string>): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(CONSTANTES.N_HOST_API + 'diario-professor', { prd_id: prd_id, arrayOfTurmas: arrayOfTurmas, nomesDiarios: nomesDiarios }, headers);
  }

  public listarDiarioProfessorDisciplinaIdAno(prd_id: number, ano: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.get(CONSTANTES.N_HOST_API + `diario-professor/listar-disciplina-ano/${prd_id}/${ano}`, headers);
  }

  public listarPorUsuarioEscola(usr_id: number, esc_id: number, ano: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.get(CONSTANTES.N_HOST_API + `diario-professor/listar-usuario-escola/${usr_id}/${esc_id}/${ano}`, headers);
  }

}
