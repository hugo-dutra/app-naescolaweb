import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CONSTANTES } from '../../shared/constantes.shared';

@Injectable({
  providedIn: 'root'
})
export class ListagemService {

  constructor(private http: HttpClient) { }

  public listarCamposTabela(nomeTabela: string): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.get(CONSTANTES.N_HOST_API + `sistema/listar-campos/${nomeTabela}`, headers);
  }

  public listarDadosCamposSelecionados(campos: string, esc_id: number, ordem: string): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.get(CONSTANTES.N_HOST_API + `sistema/dados-campos-tabela/${campos}/${esc_id}/${ordem}`, headers);
  }

}
