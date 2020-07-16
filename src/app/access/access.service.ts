import { Injectable } from '@angular/core';
import { CONSTANTES } from '../shared/constantes.shared';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AccessService {

  constructor(private http: HttpClient) { }

  public logar(email: string, senha: string): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json') };
    return this.http.post(CONSTANTES.N_HOST_API + 'usuario/pegar-token', { email, senha }, headers);
  }

  public listarPorEmailUsuario(email: string): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json') };
    return this.http.get(CONSTANTES.N_HOST_API + `escola/email-usuario/${email}`, headers);
  }

  public listarPermissoes(esc_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.get(CONSTANTES.N_HOST_API + `usuario/listar-permissao/${esc_id}`, headers);
  }

}
