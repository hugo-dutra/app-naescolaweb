import { Injectable } from '@angular/core';
import { Escola } from './escola.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CONSTANTES } from '../../shared/constantes.shared';

@Injectable({
  providedIn: 'root',
})
export class EscolaService {

  public escolas: Object;
  public escola = new Escola();

  constructor(
    private http: HttpClient,
  ) { }


  public inserir(escola: Escola): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.post(CONSTANTES.N_HOST_API + 'escola', escola, headers,);
  }

  public listarLocal(limit: number, offset: number, asc: boolean, esc_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.get(CONSTANTES.N_HOST_API + `escola/local/${limit}/${offset}/${asc}/${esc_id}`, headers);
  }

  public listarRegional(limit: number, offset: number, asc: boolean, esc_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.get(CONSTANTES.N_HOST_API + `escola/regional/${limit}/${offset}/${asc}/${esc_id}`, headers);
  }

  public listar(limit: number, offset: number, asc: boolean): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.get(CONSTANTES.N_HOST_API + `escola/${limit}/${offset}/${asc}`, headers,);
  }

  public listarAssinaturaGestor(esc_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.get(CONSTANTES.N_HOST_API + `escola/assinatura-gestor/${esc_id}`, headers,);
  }

  public excluir(id: number, logo: string): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), body: { id } };
    return this.http.delete(CONSTANTES.N_HOST_API + 'escola', headers,);
  }

  public alterar(escola: Escola): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.patch(CONSTANTES.N_HOST_API + 'escola', escola, headers,);
  }

  public filtrarLocal(valor: string, limit: number, offset: number, esc_id: number,): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.get(CONSTANTES.N_HOST_API + `escola/filtrar-local/${valor}/${limit}/${offset}/${esc_id}`, headers,);
  }

  public filtrarRegional(valor: string, limit: number, offset: number, esc_id: number,): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.get(CONSTANTES.N_HOST_API + `escola/filtrar-regional/${valor}/${limit}/${offset}/${esc_id}`, headers,);
  }

  public filtrar(valor: string, limit: number, offset: number,): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.get(CONSTANTES.N_HOST_API + `escola/filtrar/${valor}/${limit}/${offset}`, headers);
  }

  public listarDadosBoletoPagamento(esc_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.get(CONSTANTES.N_HOST_API + `escola/listar-dados-boleto-pagamento/${esc_id}`, headers,);
  }

  public listarSemDiretor(): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.get(CONSTANTES.N_HOST_API + `escola/sem-diretor`, headers,);
  }

  public listarSemDiretorRegional(esc_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.get(CONSTANTES.N_HOST_API + `escola/sem-diretor-regional/${esc_id}`, headers,);
  }

  public listarSemDiretorLocal(esc_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.get(CONSTANTES.N_HOST_API + `escola/sem-diretor-local/${esc_id}`, headers,);
  }

}
