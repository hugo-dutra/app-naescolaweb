import { Injectable } from '@angular/core';
import { Escola } from './escola.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CONSTANTES } from '../../shared/constantes.shared';

@Injectable({
  providedIn: 'root'
})
export class EscolaService {

  public escolas: Object;
  public escola = new Escola();

  constructor(
    private http: HttpClient
  ) { }

  public inserir(escola: Escola): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "inserir-escola",
      JSON.stringify(escola),
      headers
    );
  }

  public alterar(escola: Escola): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "alterar-escola",
      JSON.stringify(escola),
      headers
    );
  }

  public excluir(id: number, logo: string): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "excluir-escola",
      JSON.stringify({ id: id, logo: logo }),
      headers
    );
  }

  public listar(limit: number, offset: number, asc: boolean): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "escolas",
      JSON.stringify({ limit: limit, offset: offset, asc: asc }),
      headers
    );
  }

  public listarDadosBoletoPagamento(esc_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "listar-dados-boleto-pagamento-escola",
      JSON.stringify({ esc_id: esc_id }),
      headers
    );
  }

  public listarPorEmailUsuario(email: string): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "escolas-email-usuario",
      JSON.stringify({ email: email }),
      headers
    );
  }

  public listarSemDiretor(): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "escolas-sem-diretor",
      null,
      headers
    );
  }

  public filtrar(
    valor: string,
    limit: number,
    offset: number
  ): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "filtrar-escola",
      JSON.stringify({ valor: valor, limit: limit, offset: offset }),
      headers
    );
  }

  public enviarArquivo(arquivo: FileList): Observable<any> {
    let formData = new FormData();
    const options = { headers: new HttpHeaders().set("Authorization", localStorage.getItem("token")) };
    formData.append("image", arquivo[0], arquivo[0].name);
    return this.http.post(
      CONSTANTES.HOST_API + "enviar-logo",
      formData,
      options
    );
  }

}
