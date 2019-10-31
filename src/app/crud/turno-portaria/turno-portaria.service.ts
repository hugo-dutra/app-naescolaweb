import { Injectable } from '@angular/core';
import { TurnoPortaria } from './turno-portaria.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONSTANTES } from '../../shared/constantes.shared';

@Injectable({
  providedIn: 'root'
})
export class TurnoPortariaService {

  constructor(private http: HttpClient) { }

  public inserir(turnos_portaria: TurnoPortaria[]): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "inserir-turno-portaria",
      JSON.stringify({ turnos_portaria }),
      headers
    );
  }

  public alterar(turnos_portaria: TurnoPortaria[]): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "alterar-turno-portaria",
      JSON.stringify({ turnos_portaria }),
      headers
    );
  }

  public listar(por_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "listar-turno-portaria",
      JSON.stringify({ por_id }),
      headers
    );
  }
}
