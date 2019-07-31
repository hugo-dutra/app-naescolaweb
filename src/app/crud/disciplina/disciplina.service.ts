import { Injectable } from '@angular/core';
import { Disciplina } from './disciplina.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONSTANTES } from '../../shared/constantes.shared';

@Injectable({
  providedIn: 'root'
})
export class DisciplinaService {

  public disciplina = new Disciplina();
  constructor(private http: HttpClient) { }

  public listar(): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "disciplinas",
      null,
      headers
    );
  }

  public excluir(id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "excluir-disciplina",
      { id: id },
      headers
    );
  }

  public alterar(disciplina: Disciplina): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "alterar-disciplina",
      JSON.stringify(disciplina),
      headers
    );
  }

  public inserir(disciplina: Disciplina): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "inserir-disciplina",
      JSON.stringify(disciplina),
      headers
    );
  }
}