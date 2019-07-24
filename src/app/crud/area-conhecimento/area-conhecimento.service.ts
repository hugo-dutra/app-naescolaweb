import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AreaConhecimento } from './area-conhecimento.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CONSTANTES } from '../../shared/constantes.shared';

@Injectable()
export class AreaConhecimentoService {

  constructor(private http: HttpClient) { }

  public inserir(areaConhecimento: AreaConhecimento): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(CONSTANTES.HOST_API + "inserir-area-conhecimento", JSON.stringify(areaConhecimento), headers);
  }

  public listar(): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(CONSTANTES.HOST_API + "areas-conhecimento", null, headers);
  }

  public excluir(id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(CONSTANTES.HOST_API + "excluir-area-conhecimento", JSON.stringify({ id: id }), headers);
  }

  public alterar(areaConhecimento: AreaConhecimento): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(CONSTANTES.HOST_API + "alterar-area-conhecimento", JSON.stringify(areaConhecimento), headers);
  }

}
