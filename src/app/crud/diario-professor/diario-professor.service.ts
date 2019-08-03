import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONSTANTES } from '../../shared/constantes.shared';

@Injectable()
export class DiarioProfessorService {

  constructor(private http: HttpClient) { }

  public listarProfessorHabilitado(
    esc_id: number,
    limit: number,
    offset: number
  ): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "listar-professor-habilitado",
      JSON.stringify({ esc_id: esc_id, limit: limit, offset: offset }),
      headers
    );
  }

  public filtrarProfessorHabilitado(
    esc_id: number,
    limit: number,
    offset: number,
    valor_filtro: string
  ): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "filtrar-professor-habilitado",
      JSON.stringify({
        esc_id: esc_id,
        limit: limit,
        offset: offset,
        valor_filtro: valor_filtro
      }),
      headers
    );
  }

  public inserir(
    prd_id: number,
    arrayOfTurmas: Array<number>,
    nomesDiarios: Array<string>
  ): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "inserir-diario-professor",
      JSON.stringify({
        prd_id: prd_id,
        arrayOfTurmas: arrayOfTurmas,
        nomesDiarios: nomesDiarios
      }),
      headers
    );
  }

  public listarDiarioProfessorDisciplinaIdAno(prd_id: number, ano: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "listar-diario-professor-disciplina-ano",
      JSON.stringify({ prd_id: prd_id, ano: ano }),
      headers
    );
  }

  public listarPorUsuarioEscola(usr_id: number, esc_id: number, ano: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "listar-diario-usuario-escola",
      JSON.stringify({ usr_id: usr_id, esc_id: esc_id, ano: ano }),
      headers
    );
  }

}
