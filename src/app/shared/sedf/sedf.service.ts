import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { CONSTANTES } from '../constantes.shared';
import { Utils } from '../utils.shared';

@Injectable()
export class SedfService {

  private HOST_TOKEN_INTEGRACAO;
  private HOST_INTEGRACAO

  constructor(private http: HttpClient) {
    this.pegarUrlHostTokenIntegracao().toPromise().then((response: string) => {
      const ct = response;
      const cfg = Utils.decypher(ct);
      this.HOST_TOKEN_INTEGRACAO = cfg;
      console.log(this.HOST_TOKEN_INTEGRACAO);
    });

    this.pegarUrlHostIntegracao().toPromise().then((response: string) => {
      const ct = response;
      const cfg = Utils.decypher(ct);
      this.HOST_INTEGRACAO = cfg;
      console.log(this.HOST_INTEGRACAO);
    })
  }

  /* public gerarUrlHost(): void {
    console.log(Utils.cypher('...').toString());
  } */

  /**
   * Pega dados para serem usado na requisição do Token de integração
   */
  public listarDadosIntegracaoIEducar(): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(CONSTANTES.HOST_API + "ldai", null, headers);
  }

  /**
   * Solicita o token de acesso para ser usado na integração
   * @param _matricula Matrícula
   * @param _password Senha
   * @param _system Sistema
   */
  public pegarTokenIntegracao(_matricula: string, _password: string, _system: string): Observable<any> {
    const matricula = _matricula;
    const password = _password;
    const system = _system;
    const headers = {
      headers: new HttpHeaders()
        .append("Content-type", "application/json")
    }
    return this.http.post(this.HOST_TOKEN_INTEGRACAO, JSON.stringify({ matricula: matricula, password: password, system: system }), headers)
  }

  /**
   * Lista os estudantes da escola cujo inep é informado
   * @param token_intg Token de integração
   * @param inep INEP da escola
   */
  public listarEstudantesImportacao(token_intg: string, inep: string): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Authorization", token_intg) }
    const metodo: string = 'aluno/listabyinep/';
    return this.http.get(this.HOST_INTEGRACAO + metodo + inep, headers);
  }

  /**
   * Lista as turmas da escola cujo inep é informado
   * @param token_intg Token de integração
   * @param inep INEP da escola
   */
  public listarTurmasImportacao(token_intg: string, inep: string): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Authorization", token_intg) }
    const metodo: string = 'turma/listabyinep/';
    return this.http.get(this.HOST_INTEGRACAO + metodo + inep, headers);
  }

  /**
   * Lista professores, turmas e disciplinas para o INEP informado
   * @param token_intg
   * @param inep
   */
  public listarProfessoresDisciplinasTurmas(token_intg: string, inep: string): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Authorization", token_intg) }
    const metodo: string = 'professordisctturma/listabyinep/';
    return this.http.get(this.HOST_INTEGRACAO + metodo + inep, headers);
  }

  /**
   * Lista as notas da turma cujo código é informado
   * @param token_intg Token de integração
   * @param id_turma id do IEducar da turma cujas notas serão recebidas
   */
  public listarNotasImportacao(token_intg: string, id_turma: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Authorization", token_intg) }
    const metodo: string = 'nota/listabyturma/';
    return this.http.get(this.HOST_INTEGRACAO + metodo + id_turma, headers);
  }

  public pegarUrlHostTokenIntegracao(): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "phti",
      null,
      headers
    );
  }

  public pegarUrlHostIntegracao(): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "phi",
      null,
      headers
    );
  }


}
