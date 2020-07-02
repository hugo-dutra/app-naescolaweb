import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONSTANTES } from '../../shared/constantes.shared';
import { UsuarioEscola } from './usuario-escola.model';

@Injectable()
export class UsuarioEscolaService {
  constructor(private http: HttpClient) { }

  public inserir(usuarios: number[], escolas: number[], perfis: number[]): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(CONSTANTES.N_HOST_API + 'usuario-escola', { usuarios, escolas, perfis }, headers);
  }
}
