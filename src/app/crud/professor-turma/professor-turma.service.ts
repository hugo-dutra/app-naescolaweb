import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProfessorTurma } from './professor-turma.model';
import { Observable } from 'rxjs';
import { CONSTANTES } from '../../shared/constantes.shared';

@Injectable()
export class ProfessorTurmaService {

  constructor(private http: HttpClient) { }

  public inserir(professoresTurmas: Array<ProfessorTurma>): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.post(CONSTANTES.N_HOST_API + 'professor-turma', professoresTurmas, headers);
  }

  public integracaoInserir(professoresTurmas: Object[]): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.post(CONSTANTES.N_HOST_API + 'professor-turma/integracao', professoresTurmas, headers);
  }

  public listarProfessorTurmaDisciplinaId(
    prd_id: number,
    esc_id: number,
  ): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.get(CONSTANTES.N_HOST_API + `professor-turma/listar-professor-disciplina-id/${prd_id}/${esc_id}`, headers);
  }
}
