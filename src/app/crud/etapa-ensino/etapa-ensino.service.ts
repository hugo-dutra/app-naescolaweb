import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONSTANTES } from '../../shared/constantes.shared';
import { EtapaEnsino } from './etapa-ensino.model';

@Injectable()
export class EtapaEnsinoService {

  constructor(private http: HttpClient) { }

  public listar(): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "etapas-ensino",
      null,
      headers
    );
  }

  public alterar(etapaEnsino: EtapaEnsino): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "alterar-etapa-ensino",
      JSON.stringify(etapaEnsino),
      headers
    );
  }

  public inserir(etapaEnsino: EtapaEnsino): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "inserir-etapa-ensino",
      JSON.stringify(etapaEnsino),
      headers
    );
  }

  public integracaoInserir(etapasEnsino: EtapaEnsino[]): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "integracao-inserir-etapa-ensino",
      JSON.stringify({ etapasEnsino: etapasEnsino }),
      headers
    );
  }

  public excluir(id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "excluir-etapa-ensino",
      { id: id },
      headers
    );
  }

}
