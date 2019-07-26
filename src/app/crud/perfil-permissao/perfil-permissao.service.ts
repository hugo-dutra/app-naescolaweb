import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PerfilPermissao } from './perfil-permissao.model';
import { CONSTANTES } from '../../shared/constantes.shared';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerfilPermissaoService {

  constructor(private http: HttpClient) { }

  public inserir(pru_id: number, permissoes: PerfilPermissao[]): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "inserir-perfil-permissao",
      JSON.stringify({ pru_id: pru_id, permissoes: permissoes }),
      headers
    );
  }

  public listarPermissaoAcesso(pru_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "listar-perfil-permissao",
      JSON.stringify({ pru_id: pru_id }),
      headers
    );
  }


}
