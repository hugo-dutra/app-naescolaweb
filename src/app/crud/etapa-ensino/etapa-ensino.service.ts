import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONSTANTES } from '../../shared/constantes.shared';
import { EtapaEnsino } from './etapa-ensino.model';

@Injectable()
export class EtapaEnsinoService {

  constructor(private http: HttpClient) { }
  public listar(): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.get(CONSTANTES.N_HOST_API + 'etapa-ensino', headers);
  }

  public alterar(etapaEnsino: EtapaEnsino): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.patch(CONSTANTES.N_HOST_API + 'etapa-ensino', JSON.stringify(etapaEnsino), headers);
  }

  public inserir(etapaEnsino: EtapaEnsino): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(CONSTANTES.N_HOST_API + 'etapa-ensino', JSON.stringify(etapaEnsino), headers);
  }

  public excluir(id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')), body: { id: id }
    };
    return this.http.delete(CONSTANTES.N_HOST_API + 'etapa-ensino', headers);
  }

  public integracaoInserir(etapasEnsinoIntegracao: EtapaEnsino[]): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(CONSTANTES.N_HOST_API + 'etapa-ensino/integracao', JSON.stringify(etapasEnsinoIntegracao), headers);
  }

}
