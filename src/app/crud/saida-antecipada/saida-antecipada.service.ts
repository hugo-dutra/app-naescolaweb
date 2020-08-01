import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SaidaAntecipadaEventual } from './saida-antecipada-eventual.model';
import { Observable } from 'rxjs';
import { CONSTANTES } from '../../shared/constantes.shared';
import { SaidaAntecipadaRecorrente } from './saida-antecipada-recorrente.model';

@Injectable()
export class SaidaAntecipadaService {

  constructor(private http: HttpClient) { }
  //###################################SAÍDA ANTECIPADA EVENTUAL###################################//
  public inserirEventual(saidaAntecipadaEventual: SaidaAntecipadaEventual): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(CONSTANTES.N_HOST_API + 'saida-antecipada-eventual', saidaAntecipadaEventual, headers);
  }

  public listarEventualEstudante(est_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.get(CONSTANTES.N_HOST_API + `saida-antecipada-eventual/estudante/${est_id}`, headers);
  }

  public filtrarEventual(limite: number, offset: number, valor: string, esc_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.get(CONSTANTES.N_HOST_API + `saida-antecipada-eventual/filtrar/${limite}/${offset}/${valor}/${esc_id}`, headers);
  }

  //###################################SAÍDA ANTECIPADA RECORRENTE###################################//
  public inserirAlterarRecorrente(saidaRecorrente: SaidaAntecipadaRecorrente): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(CONSTANTES.N_HOST_API + `saida-antecipada-recorrente`, saidaRecorrente, headers)
  }

  public excluirEventual(sae_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")), body: { sae_id } }
    return this.http.delete(CONSTANTES.N_HOST_API + 'saida-antecipada-eventual', headers);
  }

}
