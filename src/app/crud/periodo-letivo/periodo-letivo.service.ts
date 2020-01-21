import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PeriodoLetivo } from './periodo-letivo.model';
import { Observable } from 'rxjs';
import { CONSTANTES } from '../../shared/constantes.shared';

@Injectable()
export class PeriodoLetivoService {

  constructor(private http: HttpClient) { }

  public inserir(periodoLetivo: PeriodoLetivo): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "inserir-periodo-letivo",
      JSON.stringify(periodoLetivo),
      headers
    );
  }

  public listar(): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "periodos-letivos",
      null,
      headers
    );
  }

  public listarPorId(prl_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "periodo-letivo-por-id",
      JSON.stringify({ prl_id: prl_id }),
      headers
    );
  }

  public listarPorAno(ano: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "periodos-letivos-por-ano",
      JSON.stringify({ ano: ano }),
      headers
    );
  }

  public excluir(id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "excluir-periodo-letivo",
      JSON.stringify({ id: id }),
      headers
    );
  }

  public alterar(periodoLetivo: PeriodoLetivo): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "alterar-periodo-letivo",
      JSON.stringify(periodoLetivo),
      headers
    );
  }

}
