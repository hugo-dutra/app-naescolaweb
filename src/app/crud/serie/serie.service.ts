import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONSTANTES } from '../../shared/constantes.shared';
import { Serie } from './serie.model';

@Injectable()
export class SerieService {

  constructor(private http: HttpClient) { }

  public listar(): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.get(CONSTANTES.N_HOST_API + 'serie', headers);
  }

  public inserir(serie: Serie): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(CONSTANTES.N_HOST_API + 'serie', JSON.stringify(serie), headers);
  }

  public alterar(serie: Serie): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.patch(CONSTANTES.N_HOST_API + 'serie', serie, headers);
  }

  public excluir(id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')), body: { id: id }
    };
    return this.http.delete(CONSTANTES.N_HOST_API + 'serie', headers);
  }

  public integracaoInserir(series: Serie[]): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(CONSTANTES.N_HOST_API + 'serie/integracao', series, headers);
  }

}
