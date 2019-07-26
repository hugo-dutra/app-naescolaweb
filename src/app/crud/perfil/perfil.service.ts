import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Perfil } from './perfil.model';
import { CONSTANTES } from '../../shared/constantes.shared';

@Injectable()
export class PerfilService {

  constructor(private http: HttpClient) { }

  public listar(): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "perfis",
      null,
      headers
    );
  }

  public inserir(perfil: Perfil): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "inserir-perfil",
      JSON.stringify(perfil),
      headers
    );
  }

  public alterar(perfil: Perfil): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "alterar-perfil",
      JSON.stringify(perfil),
      headers
    );
  }

  public excluir(id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "excluir-perfil",
      JSON.stringify({ id: id }),
      headers
    );
  }

}
