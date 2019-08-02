import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Diretor } from './diretor.model';
import { CONSTANTES } from '../../shared/constantes.shared';

@Injectable()
export class DiretorService {

  constructor(private http: HttpClient) { }

  public inserir(diretor: Diretor): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "inserir-diretor",
      JSON.stringify(diretor),
      headers
    );

  }

  public enviarArquivo(arquivo: FileList): Observable<any> {
    let formData = new FormData();
    const options = {
      headers: new HttpHeaders().set(
        "Authorization",
        localStorage.getItem("token")
      )
    };

    formData.append("image", arquivo[0], arquivo[0].name);
    return this.http.post(
      CONSTANTES.HOST_API + "enviar-avatar",
      formData,
      options
    );
  }




  /*
  limit: Quantidade de registros
  offset: Posição a partir da qual os registros serão exibitos
  asc: Se os registros virão em ordem ascendente ou decrescente
  */
  public listar(limit: number, offset: number, asc: boolean): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "diretores",
      JSON.stringify({ limit: limit, offset: offset, asc: asc }),
      headers
    );
  }

  public listarSemEscola(): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "diretores-sem-escola",
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
      CONSTANTES.HOST_API + "filtrar-diretor",
      JSON.stringify({ valor: valor, limit: limit, offset: offset }),
      headers
    );
  }

  public alterar(diretor: Diretor): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "alterar-diretor",
      JSON.stringify(diretor),
      headers
    );
  }

  public excluir(id: number, foto: string): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "excluir-diretor",
      JSON.stringify({ id: id, foto: foto }),
      headers
    );
  }

}
