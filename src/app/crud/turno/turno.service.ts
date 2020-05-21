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
    return this.http.post(CONSTANTES.N_HOST_API + "turno", JSON.stringify(turno), headers);
  }

  public listar(esc_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders()
        .append("Content-type", "application/json")
        .append("Authorization", localStorage.getItem("token"))
    }
    return this.http.get(CONSTANTES.N_HOST_API + `turno/${esc_id}`, headers);
  }

  public alterar(turno: Turno): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.patch(CONSTANTES.N_HOST_API + "turno", turno, headers);
  }

  public excluir(id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders()
        .append("Content-type", "application/json")
        .append("Authorization", localStorage.getItem("token")), body: { id: id }
    }
    return this.http.delete(CONSTANTES.N_HOST_API + "turno", headers);
  }

  public integracaoInserir(turnos: Turno[], esc_id: number): Observable<any> {
    console.log(turnos)
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(CONSTANTES.N_HOST_API + "turno/integracao", { turnos: turnos, esc_id: esc_id }, headers);
  }


}
