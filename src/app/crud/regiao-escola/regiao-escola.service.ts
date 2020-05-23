import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { RegiaoEscola } from './regiao-escola.model';
import { Observable } from 'rxjs';
import { CONSTANTES } from '../../shared/constantes.shared';

@Injectable({
  providedIn: 'root'
})
export class RegiaoEscolaService {

  constructor(private http: HttpClient) { }

  public alterar(regiaoEscola: RegiaoEscola): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.patch(CONSTANTES.N_HOST_API + "regiao-escola", regiaoEscola, headers);
  }

  public excluir(id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders()
        .append("Content-type", "application/json")
        .append("Authorization", localStorage.getItem("token")), body: { id: id }
    }
    return this.http.delete(CONSTANTES.N_HOST_API + "regiao-escola", headers);
  }

  public inserir(regiaoEscola: RegiaoEscola): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(CONSTANTES.N_HOST_API + "regiao-escola", regiaoEscola, headers);
  }

  public listar(): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.get(CONSTANTES.N_HOST_API + "regiao-escola", headers);
  }

}
