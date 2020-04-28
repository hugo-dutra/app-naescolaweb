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
    return this.http.post(
      CONSTANTES.HOST_API + "listar-campos-tabela",
      JSON.stringify({ nomeTabela: nomeTabela }),
      headers
    );
  }

  public listarDadosCamposSelecionados(campos: string, esc_id: number, ordem: string): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "listar-dados-campos-tabela",
      JSON.stringify({ campos: campos, esc_id: esc_id, ordem: ordem }),
      headers
    );
  }

}
