import { CONSTANTES } from './../../shared/constantes.shared';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AtestadoMedico } from './atestado-medico.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AtestadoMedicoService {

  constructor(private http: HttpClient) { }

  public consultarCid(codigo: string): Promise<Object> {
    return new Promise((resolve, reject) => {
      this.http.get(`https://cid10-api.herokuapp.com/cid10/${codigo}`).toPromise().then((response: Object) => {
        resolve(response);
      }).catch((reason: any) => {
        reject(reason);
      });
    });
  }

  public inserir(atestadoMedico: AtestadoMedico): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(CONSTANTES.N_HOST_API + 'atestado-medico', atestadoMedico, headers);
  }

  public alterar(atestadoMedico: AtestadoMedico): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.patch(CONSTANTES.N_HOST_API + 'atestado-medico', atestadoMedico, headers);
  }

  public listar(nomeEstudante: string, esc_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.get(CONSTANTES.N_HOST_API + `atestado-medico/${nomeEstudante}/${esc_id}`, headers);
  }


  public excluir(atm_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')), body: { atm_id }
    };
    return this.http.delete(CONSTANTES.N_HOST_API + 'atestado-medico', headers);
  }

}
