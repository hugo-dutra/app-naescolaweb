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
    return this.http.post(CONSTANTES.N_HOST_API + 'periodo-letivo', periodoLetivo, headers);
  }

  public listar(): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.get(CONSTANTES.N_HOST_API + 'periodo-letivo', headers);
  }

  public alterar(periodoLetivo: PeriodoLetivo): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.patch(CONSTANTES.N_HOST_API + 'periodo-letivo', periodoLetivo, headers);
  }

  public excluir(id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")), body: { id } }
    return this.http.delete(CONSTANTES.N_HOST_API + 'periodo-letivo', headers);
  }

  public listarPorId(prl_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.get(CONSTANTES.N_HOST_API + `periodo-letivo/prl_id/${prl_id}`, headers);
  }

  public listarPorAno(ano: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.get(CONSTANTES.N_HOST_API + `periodo-letivo/ano/${ano}`, headers);
  }





}
