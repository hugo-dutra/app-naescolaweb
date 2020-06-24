import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Perfil } from './perfil.model';
import { CONSTANTES } from '../../shared/constantes.shared';

@Injectable()
export class PerfilService {

  constructor(private http: HttpClient) { }

  public listar(nivel: number, esc_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.get(CONSTANTES.N_HOST_API + `perfil-usuario/${nivel}/${esc_id}`, headers,);
  }

  public inserir(perfil: Perfil): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.post(CONSTANTES.N_HOST_API + 'perfil-usuario', perfil, headers,);
  }

  public listarEscopoPerfil(): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.get(CONSTANTES.N_HOST_API + 'escopo-perfil-usuario', headers,);
  }

  public alterar(perfil: Perfil): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.patch(CONSTANTES.N_HOST_API + 'perfil-usuario', perfil, headers,);
  }

  public excluir(id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), body: { id } };
    return this.http.delete(CONSTANTES.N_HOST_API + 'perfil-usuario', headers,);
  }

}
