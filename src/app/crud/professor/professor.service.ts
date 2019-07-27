import { Injectable } from '@angular/core';
import { Professor } from './professor.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CONSTANTES } from '../../shared/constantes.shared';

@Injectable()
export class ProfessorService {

  public professor = new Professor();

  constructor(
    private http: HttpClient
  ) { }

  public listar(limit: number, offset: number, asc: boolean): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "professores",
      JSON.stringify({ limit: limit, offset: offset, asc: asc }),
      headers
    );
  }

  public listarDisciplina(prf_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "listar-disciplinas-professor",
      JSON.stringify({ prf_id: prf_id }),
      headers
    );
  }

  public listarTurmaDisciplina(esc_id: number, usr_id: number, ano: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "professores-listar-turma-disciplina",
      JSON.stringify({ esc_id: esc_id, usr_id: usr_id, ano: ano }),
      headers
    );
  }

  public listarSemDisciplina(
    limit: number,
    offset: number,
    asc: boolean
  ): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "professores-sem-disciplina",
      JSON.stringify({ limit: limit, offset: offset, asc: asc }),
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

  public listarPorEscola(esc_id: number, todos: boolean): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "professores-listar-escola-id",
      JSON.stringify({ esc_id: esc_id, todos: todos }),
      headers
    );
  }

  public filtrar(
    valor: string,
    limit: number,
    offset: number
  ): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "filtrar-professor",
      JSON.stringify({ valor: valor, limit: limit, offset: offset }),
      headers
    );
  }

  public inserir(professor: Professor): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "inserir-professor",
      JSON.stringify(professor),
      headers
    );
  }

  public alterar(professor: Professor): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "alterar-professor",
      JSON.stringify(professor),
      headers
    );
  }

  public excluir(id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "excluir-professor",
      JSON.stringify({ id: id }),
      headers
    );
  }

}
