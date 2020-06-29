import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProfessorEscola } from './professor-escola.model';
import { CONSTANTES } from '../../shared/constantes.shared';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfessorEscolaService {

  constructor(private http: HttpClient) { }

  public integracaoInserir(professoresEscolas: Array<Object>, esc_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.post(CONSTANTES.N_HOST_API + 'professor-escola/integracao', { professoresEscolas: professoresEscolas, esc_id: esc_id }, headers);
  }

  public inserir(professoresEscolas: Array<ProfessorEscola>): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.post(CONSTANTES.N_HOST_API + 'professor-escola/manual', professoresEscolas, headers,);
  }



}
