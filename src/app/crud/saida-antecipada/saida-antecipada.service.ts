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
    return this.http.post(CONSTANTES.HOST_API + 'inserir-saida-antecipada-eventual',
      JSON.stringify({ saidaEventual: saidaAntecipadaEventual }),
      headers);
  }

  public listarEventualEstudante(est_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http
      .post(CONSTANTES.HOST_API + 'listar-saida-antecipada-eventual-estudante',
        JSON.stringify({ est_id: est_id }),
        headers);
  }

  public excluirEventual(sae_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http
      .post(CONSTANTES.HOST_API + 'excluir-saida-antecipada-eventual',
        JSON.stringify({ sae_id: sae_id }),
        headers);
  }

  public listarEventual(limite: string, off_set: number, ascendente: Boolean): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http
      .post(CONSTANTES.HOST_API + 'listar-saida-antecipada-eventual',
        JSON.stringify({ limite: limite, off_set: off_set, ascendente: ascendente }),
        headers);
  }

  public filtrarEventual(limite: number, offset: number, valor: string, esc_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http
      .post(CONSTANTES.HOST_API + 'filtrar-saida-antecipada-eventual',
        JSON.stringify({ limite: limite, offset: offset, valor: valor, esc_id: esc_id }),
        headers);
  }

  //###################################SAÍDA ANTECIPADA RECORRENTE###################################//
  public inserirAlterarRecorrente(saidaRecorrente: SaidaAntecipadaRecorrente): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(CONSTANTES.HOST_API + 'inserir-alterar-saida-antecipada-recorrente',
      JSON.stringify({ saidaRecorrente: saidaRecorrente }),
      headers
    )
  }

}
