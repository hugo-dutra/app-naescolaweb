import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CONSTANTES } from '../../shared/constantes.shared';
import { Observable } from 'rxjs';
import { DiretorEscola } from './diretor-escola.model';

@Injectable()
export class DiretorEscolaService {

  constructor(private http: HttpClient) { }

  public inserir(diretores: number[], escolas: number[]): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.post(CONSTANTES.N_HOST_API + 'diretor-escola', { diretores: diretores, escolas: escolas }, headers);
  }

}
