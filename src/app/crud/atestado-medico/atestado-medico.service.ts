import { CONSTANTES } from './../../shared/constantes.shared';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AtestadoMedico } from './atestado-medico.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AtestadoMedicoService {

  constructor(private http: HttpClient) { }

  public consultarCid(codigo: string): Promise<Object> {
    return new Promise((resolve, reject) => {
      this.http.get(`http://cid10-api.herokuapp.com/cid10/${codigo}`).toPromise().then((response: Object) => {
        resolve(response)
      }).catch((reason: any) => {
        reject(reason)
      })
    })
  }

  public inserir(atestadoMedico: AtestadoMedico): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "inserir-atestado-medico",
      JSON.stringify({ atestadoMedico: atestadoMedico }),
      headers
    );
  }

  public alterar(atestadoMedico: AtestadoMedico): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "alterar-atestado-medico",
      JSON.stringify({ atestadoMedico: atestadoMedico }),
      headers
    );
  }

  public excluir(atestadoMedico: AtestadoMedico): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "excluir-atestado-medico",
      JSON.stringify({ atestadoMedico: atestadoMedico }),
      headers
    );
  }

  public listar(nomeEstudante: string): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "listar-atestado-medico",
      JSON.stringify({ nomeEstudante: nomeEstudante }),
      headers
    );
  }

}
