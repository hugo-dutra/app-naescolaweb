import { Injectable } from '@angular/core';
import { EntradaPosterior } from './entrada-posterior.model';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { CONSTANTES } from '../../shared/constantes.shared';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntradaPosteriorService {

  constructor(private http: HttpClient) { }

  public inserir(arrayEstudantesEntradaPosterior: EntradaPosterior[]): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'inserir-entrada-posterior',
      JSON.stringify({ arrayEstudantesEntradaPosterior: arrayEstudantesEntradaPosterior }),
      headers,
    );
  }

  public listar(esc_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'listar-entrada-posterior',
      JSON.stringify({ esc_id: esc_id }),
      headers,
    );
  }

  public excluir(epe_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'excluir-entrada-posterior',
      JSON.stringify({ epe_id: epe_id }),
      headers,
    );
  }


}
