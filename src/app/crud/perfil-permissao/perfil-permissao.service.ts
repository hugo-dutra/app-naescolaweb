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
    return this.http.post(CONSTANTES.N_HOST_API + "perfil-permissao", { pru_id: pru_id, permissoes: permissoes }, headers);
  }

  public listarPermissaoAcesso(pru_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.get(CONSTANTES.N_HOST_API + `permissao-acesso/perfil_usuario_id/${pru_id}`, headers);
  }

}
