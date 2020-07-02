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
    //return this.http.post(CONSTANTES.HOST_API + 'pegar-token', { usr_email_txt: email, usr_senha_txt: senha }, headers);
  }

  public listarPorEmailUsuario(email: string): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json') };
    return this.http.get(CONSTANTES.N_HOST_API + `escola/email-usuario/${email}`, headers);
    //return this.http.post(CONSTANTES.HOST_API + 'escolas-email-usuario', JSON.stringify({ email: email }), headers);
  }


  public listarPermissoes(esc_id: number): Observable<any> {
    debugger;
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.post(CONSTANTES.HOST_API + 'pegar-permissao-usuario', JSON.stringify({ esc_id: esc_id }), headers);
    //return this.http.post(CONSTANTES.HOST_API + 'pegar-permissao-usuario', JSON.stringify({ esc_id: esc_id }), headers);
  }



  /**************************************************************************************************************************************************/
  /**************************************************************************************************************************************************/
  /**************************************************************************************************************************************************/

  public deslogar(): Observable<any> {
    /* const headers = { headers: new HttpHeaders().append("Content-type", "application/json") } */
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(CONSTANTES.HOST_API + 'invalidar-token', null, headers);

  }



  public listarEscolas(limit: number, offset: number, asc: boolean): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json') };
    return this.http.post(CONSTANTES.HOST_API + 'escolas',
      JSON.stringify({ limit: limit, offset: offset, asc: asc }), headers);
  }



}
