import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ComunicadoDiverso } from './comunicado-diverso.model';
import { Observable } from 'rxjs';
import { CONSTANTES } from '../../shared/constantes.shared';

@Injectable()
export class ComunicadoDiversoService {

  constructor(private http: HttpClient) { }


  public inserirMuitos(comunicadosDiversos: ComunicadoDiverso[]): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(CONSTANTES.N_HOST_API + 'comunicado-diverso/multiplos', comunicadosDiversos, headers);
  }

  public filtrar(status: number, data_inicio: string, data_fim: string,
    limit: number, offset: number, esc_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.get(CONSTANTES.N_HOST_API + `comunicado-diverso/filtrar/${status}/${data_inicio}/${data_fim}/${limit}/${offset}/${esc_id}`, headers);
  }

  public inserir(comunicadoDiverso: ComunicadoDiverso): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(CONSTANTES.N_HOST_API + 'comunicado-diverso/simples', comunicadoDiverso, headers);
  }

  public alterarStatusMensagemEntrega(arrayDeComunicadosVerificados: Object[]): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(CONSTANTES.N_HOST_API + 'comunicado-diverso/alterar-status-entrega-mensagem', arrayDeComunicadosVerificados, headers);
  }

  /*************************************************************************************************/
  /*************************************************************************************************/
  /*************************************************************************************************/







}
