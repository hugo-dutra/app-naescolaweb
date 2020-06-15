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
    return this.http.post(CONSTANTES.N_HOST_API + 'atividade-extra-classe', atividadeExtraClasse, headers);
  }

  public inserirEstudanteAtividade(atividadeExtraEstudante: AtividadeExtraEstudante[]): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(CONSTANTES.N_HOST_API + 'atividade-extra-estudante', atividadeExtraEstudante, headers);
  }

  public inserirAnexoAtividadeExtraClasse(anexosAtividadeExtraClasse: Object[]): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(CONSTANTES.N_HOST_API + 'anexo-atividade-extra', anexosAtividadeExtraClasse, headers);
  }

  public listarAtividadeExtraClasse(esc_id: number, dataInicio: string, dataFim: string): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.get(CONSTANTES.N_HOST_API + `atividade-extra-classe/${esc_id}/${dataInicio}/${dataFim}`, headers);
  }


  public listarAnexoAtividadeExtraClasse(aec_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.get(CONSTANTES.N_HOST_API + `anexo-atividade-extra/${aec_id}`, headers);
  }

  public listarEstudanteAtividadeExtraClasse(aec_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.get(CONSTANTES.N_HOST_API + `atividade-extra-estudante/${aec_id}`, headers);
  }











}
