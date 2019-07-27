import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONSTANTES } from '../../shared/constantes.shared';
import { UsuarioEscola } from './usuario-escola.model';

@Injectable()
export class UsuarioEscolaService {
  constructor(private http: HttpClient) { }

  public inserir(
    usuarios: number[],
    escolas: number[],
    perfis: number[]
  ): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "inserir-usuario-escola",
      JSON.stringify({ usuarios: usuarios, escolas: escolas, perfis: perfis }),
      headers
    );
  }

  public excluir(usuarioEscola: UsuarioEscola): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "excluir-usuario-escola",
      JSON.stringify(usuarioEscola),
      headers
    );
  }
}
