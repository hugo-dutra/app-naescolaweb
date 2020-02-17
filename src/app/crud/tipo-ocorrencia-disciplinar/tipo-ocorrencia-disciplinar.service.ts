import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TipoOcorrenciaDisciplinar } from './tipo-ocorrencia-disciplinar.model';
import { Observable } from 'rxjs';
import { CONSTANTES } from '../../shared/constantes.shared';

@Injectable({
  providedIn: 'root'
})
export class TipoOcorrenciaDisciplinarService {

  constructor(private http: HttpClient) { }

  public inserir(tipoOcorrenciaDisciplinar: TipoOcorrenciaDisciplinar): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(CONSTANTES.HOST_API + "inserir-tipo-ocorrencia", JSON.stringify({ tipoOcorrenciaDisciplinar: tipoOcorrenciaDisciplinar }), headers);
  }

  public alterar(tipoOcorrenciaDisciplinar: TipoOcorrenciaDisciplinar): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(CONSTANTES.HOST_API + "alterar-tipo-ocorrencia", JSON.stringify({ tipoOcorrenciaDisciplinar: tipoOcorrenciaDisciplinar }), headers);
  }

  public excluir(id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(CONSTANTES.HOST_API + "excluir-tipo-ocorrencia", JSON.stringify({ id: id }), headers);
  }

  public listar(limit: number, offset: number, ascendente: boolean, esc_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(CONSTANTES.HOST_API + "tipos-ocorrencias", JSON.stringify({ limit: limit, offset: offset, ascendente: ascendente, esc_id: esc_id }), headers);
  }

  public listarEstId(est_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(CONSTANTES.HOST_API + "tipos-ocorrencias-estudante", JSON.stringify({ est_id: est_id }), headers);
  }

  public listarNomeEstudante(nome: string, esc_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(CONSTANTES.HOST_API + "tipos-ocorrencias-nome-estudante", JSON.stringify({ nome: nome, esc_id: esc_id }), headers);
  }

}
