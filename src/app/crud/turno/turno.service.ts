import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Turno } from './turno.model';
import { CONSTANTES } from '../../shared/constantes.shared';

@Injectable()
export class TurnoService {

  constructor(private http: HttpClient) { }

  public inserir(turno: Turno): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "inserir-turno",
      JSON.stringify(turno),
      headers
    );
  }

  public integracaoInserir(turnos: Turno[], esc_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "integracao-inserir-turno",
      JSON.stringify({ turnos: turnos, esc_id: esc_id }),
      headers
    );
  }

  public listar(esc_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "turnos",
      JSON.stringify({ esc_id: esc_id }),
      headers
    );
  }

  public excluir(id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "excluir-turno",
      JSON.stringify({ id: id }),
      headers
    );
  }

  public alterar(turno: Turno): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "alterar-turno",
      JSON.stringify(turno),
      headers
    );
  }
}
