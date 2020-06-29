import { Injectable } from '@angular/core';
import { Professor } from './professor.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONSTANTES } from '../../shared/constantes.shared';

@Injectable()
export class ProfessorService {

  public professor = new Professor();

  constructor(
    private http: HttpClient
  ) { }

  public inserir(professor: Professor): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(CONSTANTES.N_HOST_API + "professor", professor, headers);
  }

  public listar(limit: number, offset: number, asc: boolean, usr_id: number, esc_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.get(CONSTANTES.N_HOST_API + `professor/${limit}/${offset}/${asc}/${usr_id}/${esc_id}`, headers);
  }

  public alterar(professor: Professor): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.patch(CONSTANTES.N_HOST_API + "professor", JSON.stringify(professor), headers);
  }

  public excluir(id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")), body: { id: id } }
    return this.http.delete(CONSTANTES.N_HOST_API + "professor", headers);
  }

  public listarDisciplina(prf_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.get(CONSTANTES.N_HOST_API + `professor/disciplinas/${prf_id}`, headers);
  }

  public integracaoInserir(professores: Object[]): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(CONSTANTES.N_HOST_API + "professor/integracao-inserir", professores, headers);
  }

  public listarPorEscola(esc_id: number, todos: boolean): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.get(CONSTANTES.N_HOST_API + `professor-escola/listar-escola-id/${esc_id}/${todos}`, headers);
  }





  /*********************************************************************************************************************/
  /*********************************************************************************************************************/
  /*********************************************************************************************************************/


  public listarTurmaDisciplina(esc_id: number, usr_id: number, ano: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "professores-listar-turma-disciplina",
      JSON.stringify({ esc_id: esc_id, usr_id: usr_id, ano: ano }),
      headers
    );
  }

  public listarSemDisciplina(
    limit: number, offset: number, asc: boolean,
    usr_id: number, esc_id: number,
  ): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "professores-sem-disciplina",
      JSON.stringify({ limit: limit, offset: offset, asc: asc, usr_id: usr_id, esc_id: esc_id }),
      headers
    );
  }

  public listarSemEscola(): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "professores-sem-escola",
      null,
      headers
    );
  }

  public filtrar(
    valor: string, limit: number, offset: number,
    esc_id: number, usr_id: number
  ): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "filtrar-professor",
      JSON.stringify({
        valor: valor,
        limit: limit,
        offset: offset,
        esc_id: esc_id,
        usr_id: usr_id
      }),
      headers
    );
  }


}
