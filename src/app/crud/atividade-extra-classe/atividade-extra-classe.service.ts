import { AnexoAtividade } from './anexo.atividade.model';
import { AtividadeExtraClasse } from './atividade-extra-classe.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONSTANTES } from '../../shared/constantes.shared';
import { AtividadeExtraEstudante } from './atividade-extra-estudante.model';


@Injectable({
  providedIn: 'root',
})
export class AtividadeExtraClasseService {

  constructor(private http: HttpClient) { }

  public inserirAtividadeExtraClasse(atividadeExtraClasse: AtividadeExtraClasse): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };

    return this.http.post(
      CONSTANTES.HOST_API + 'inserir-atividade-extra-classe',
      JSON.stringify({
        atividadeExtraClasse: atividadeExtraClasse,
      }),
      headers,
    );
  }

  public inserirAnexoAtividadeExtraClasse(anexosAtividadeExtraClasse: Object[]): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };

    return this.http.post(
      CONSTANTES.HOST_API + 'inserir-anexo-atividade-extra-classe',
      JSON.stringify({
        anexosAtividadeExtraClasse: anexosAtividadeExtraClasse,
      }),
      headers,
    );
  }

  public inserirEstudanteAtividade(atividadeExtraEstudante: AtividadeExtraEstudante[]): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };

    return this.http.post(
      CONSTANTES.HOST_API + 'inserir-estudante-atividade-extra-classe',
      JSON.stringify({
        atividadeExtraEstudante: atividadeExtraEstudante,
      }),
      headers,
    );
  }

  public listarAtividadeExtraClasse(esc_id: number, dataInicio: string, dataFim: string): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };

    return this.http.post(
      CONSTANTES.HOST_API + 'listar-atividade-extra-classe',
      JSON.stringify({
        esc_id: esc_id, dataInicio: dataInicio, dataFim: dataFim,
      }),
      headers,
    );
  }

  public listarAnexoAtividadeExtraClasse(esc_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };

    return this.http.post(
      CONSTANTES.HOST_API + 'listar-anexo-atividade-extra-classe',
      JSON.stringify({
        esc_id: esc_id,
      }),
      headers,
    );
  }

  public listarEstudanteAtividadeExtraClasse(aec_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };

    return this.http.post(
      CONSTANTES.HOST_API + 'listar-estudante-atividade-extra-classe',
      JSON.stringify({
        aec_id: aec_id,
      }),
      headers,
    );
  }


}
