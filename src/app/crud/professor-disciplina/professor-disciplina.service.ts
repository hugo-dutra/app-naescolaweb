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

  public desvincularProfessorDisciplina(prf_id: number, dsp_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "desvincular-professor-disciplina",
      JSON.stringify({ prf_id: prf_id, dsp_id: dsp_id }),
      headers
    );
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

  public integracaoInserir(professoresDisciplinas: Object[]): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "integracao-inserir-professor-disciplina",
      JSON.stringify({ professoresDisciplinas: professoresDisciplinas }),
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
