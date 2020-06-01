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
    return this.http.post(CONSTANTES.N_HOST_API + "tipo-ocorrencia-disciplinar", tipoOcorrenciaDisciplinar, headers);
  }

  public listar(limit: number, offset: number, ascendente: boolean, esc_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.get(CONSTANTES.N_HOST_API + `tipo-ocorrencia-disciplinar/${limit}/${offset}/${ascendente}/${esc_id}`, headers);
  }


  public alterar(tipoOcorrenciaDisciplinar: TipoOcorrenciaDisciplinar): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.patch(CONSTANTES.N_HOST_API + "tipo-ocorrencia-disciplinar", tipoOcorrenciaDisciplinar, headers);
  }

  public excluir(id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")), body: { id: id } }
    return this.http.delete(CONSTANTES.N_HOST_API + "tipo-ocorrencia-disciplinar", headers);
  }

  /******************************************************************************************************************************************************************/
  public listarEstId(est_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(CONSTANTES.HOST_API + "tipos-ocorrencias-estudante", JSON.stringify({ est_id: est_id }), headers);
  }

  public listarNomeEstudante(nome: string, esc_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(CONSTANTES.HOST_API + "tipos-ocorrencias-nome-estudante", JSON.stringify({ nome: nome, esc_id: esc_id }), headers);
  }

}
