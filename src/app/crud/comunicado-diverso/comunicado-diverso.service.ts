import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ComunicadoDiverso } from './comunicado-diverso.model';
import { Observable } from 'rxjs';
import { CONSTANTES } from '../../shared/constantes.shared';

@Injectable()
export class ComunicadoDiversoService {

  constructor(private http: HttpClient) { }

  public inserir(comunicadoDiverso: ComunicadoDiverso): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "inserir-comunicado-diverso",
      JSON.stringify(comunicadoDiverso),
      headers
    );
  }

  public inserirMuitos(comunicadosDiversos: ComunicadoDiverso[]): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "inserir-multiplo-comunicado-diverso",
      JSON.stringify({ comunicadosDiversos: comunicadosDiversos }),
      headers
    );
  }

  public alterarStatusMensagemEntrega(arrayDeComunicadosVerificados: Object[]): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "alterar-status-entrega-mensagem-comunicado-diverso",
      JSON.stringify({ arrayDeComunicadosVerificados: arrayDeComunicadosVerificados }),
      headers
    );
  }


  public filtrar(status: number, data_inicio: string, data_fim: string, limit: number, offset: number, esc_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "filtrar-comunicado-diverso",
      JSON.stringify({ status: status, data_inicio: data_inicio, data_fim: data_fim, limit: limit, offset: offset, esc_id: esc_id }),
      headers
    );
  }


}
