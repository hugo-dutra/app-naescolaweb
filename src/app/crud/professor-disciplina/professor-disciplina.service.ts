import { Injectable } from '@angular/core';
import { ProfessorDisciplina } from './professor-disciplina.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONSTANTES } from '../../shared/constantes.shared';

@Injectable({
  providedIn: 'root',
})
export class ProfessorDisciplinaService {

  public professoresDisciplinas: Object;
  public professorDisciplina = new ProfessorDisciplina();
  constructor(private http: HttpClient) { }


  public inserir(
    professores: number[],
    disciplinas: number[],
  ): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(CONSTANTES.N_HOST_API + 'professor-disciplina', { professores: professores, disciplinas: disciplinas }, headers);
  }


  public integracaoInserir(professoresDisciplinas: Object[]): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(CONSTANTES.N_HOST_API + 'professor-disciplina/integracao', professoresDisciplinas, headers);
  }

  public desvincularProfessorDisciplina(prf_id: number, dsp_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(CONSTANTES.N_HOST_API + 'professor-disciplina/desvincular', { prf_id, dsp_id }, headers);
  }

  public listarDisciplina(esc_id: number, todos: boolean): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.get(CONSTANTES.N_HOST_API + `professor-disciplina/listar-disciplina/${esc_id}/${todos}`, headers);
  }

}
