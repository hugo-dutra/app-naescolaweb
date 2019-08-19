import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { CONSTANTES } from '../constantes.shared';

@Injectable()
export class SedfService {

  constructor(private http: HttpClient) { }

  public listarDadosIntegracaoIEducar(): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(CONSTANTES.HOST_API + "listar-dados-acesso-integracao", null, headers);
  }

  public pegarTokenIntegracao(_matricula: string, _password: string, _system: string): Observable<any> {
    const matricula = _matricula;
    const password = _password;
    const system = _system;
    const headers = {
      headers: new HttpHeaders()
        .append("Content-type", "application/json")
    }
    return this.http.post(CONSTANTES.HOST_TOKEN_INTEGRACAO, JSON.stringify({ matricula: matricula, password: password, system: system }), headers)
  }

  public listarEstudantesImportacao(token_intg: string, inep: string): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Authorization", token_intg) }
    const metodo: string = 'aluno/listabyinep/';
    return this.http.get(CONSTANTES.HOST_INTEGRACAO + metodo + inep, headers);
  }

  public listarTurmasImportacao(token_intg: string, inep: string): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Authorization", token_intg) }
    const metodo: string = 'turma/listabyinep/';
    return this.http.get(CONSTANTES.HOST_INTEGRACAO + metodo + inep, headers);
  }

}
