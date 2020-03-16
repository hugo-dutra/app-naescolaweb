import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProfessorTurma } from './professor-turma.model';
import { Observable } from 'rxjs';
import { CONSTANTES } from '../../shared/constantes.shared';

@Injectable()
export class ProfessorTurmaService {

  constructor(private http: HttpClient) { }

  public inserir(professoresTurmas: Array<ProfessorTurma>): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'inserir-professor-turma',
      JSON.stringify({ professoresTurmas: professoresTurmas }),
      headers,
    );
  }

  public integracaoInserir(professoresTurmas: Object[]): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'integracao-inserir-professor-turma',
      JSON.stringify({ professoresTurmas: professoresTurmas }),
      headers,
    );
  }

  public listarProfessorTurmaDisciplinaId(
    prd_id: number,
    esc_id: number,
  ): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'listar-professor-turma-disciplina-id',
      JSON.stringify({ prd_id: prd_id, esc_id: esc_id }),
      headers,
    );
  }

}
