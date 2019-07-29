import { Injectable } from '@angular/core';
import { ProfessorDisciplina } from './professor-disciplina.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONSTANTES } from '../../shared/constantes.shared';

@Injectable({
  providedIn: 'root'
})
export class ProfessorDisciplinaService {

  public professoresDisciplinas: Object;
  public professorDisciplina = new ProfessorDisciplina();
  constructor(private http: HttpClient) { }

  public alterar(professorDisciplina: ProfessorDisciplina): Observable<any> {
    /*   let headers = new Headers();
      headers.append("Content-type", "application/json");
      headers.append("Authorization",localStorage.getItem("token"));
      return this.http.post(
        CONSTANTES.HOST_API + "alterar-professor-disciplina",
        JSON.stringify({ professorDisciplina: professorDisciplina }),
        new RequestOptions({ headers: headers })
      ); */
    return null;
  }

  public excluir(professorDisciplina: ProfessorDisciplina): Observable<any> {
    /*   let headers = new Headers();
      headers.append("Content-type", "application/json");
      headers.append("Authorization",localStorage.getItem("token"));
      return this.http.post(
        CONSTANTES.HOST_API + "excluir-professor-disciplina",
        JSON.stringify({ professorDisciplina: professorDisciplina }),
        new RequestOptions({ headers: headers })
      ); */
    return null;
  }

  public inserir(
    professores: number[],
    disciplinas: number[]
  ): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "inserir-professor-disciplina",
      JSON.stringify({ professores: professores, disciplinas: disciplinas }),
      headers
    );
  }

  public listarDisciplina(esc_id: number, todos: boolean): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "listar-professor-disciplina",
      JSON.stringify({ esc_id: esc_id, todos: todos }),
      headers
    );
  }

}
