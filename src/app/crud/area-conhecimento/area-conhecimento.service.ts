import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AreaConhecimento } from './area-conhecimento.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CONSTANTES } from '../../shared/constantes.shared';

@Injectable()
export class AreaConhecimentoService {
  constructor(private http: HttpClient) { }

  public inserir(areaConhecimento: AreaConhecimento): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(CONSTANTES.N_HOST_API + 'area-conhecimento', JSON.stringify(areaConhecimento), headers);
  }

  public listar(): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.get(CONSTANTES.N_HOST_API + 'area-conhecimento', headers);
  }

  public alterar(areaConhecimento: AreaConhecimento): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.patch(CONSTANTES.N_HOST_API + 'area-conhecimento', JSON.stringify(areaConhecimento), headers);
  }

  public excluir(id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')), body: { id: id }
    };
    return this.http.delete(CONSTANTES.N_HOST_API + 'area-conhecimento', headers);
  }

}
