import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Diretor } from './diretor.model';
import { CONSTANTES } from '../../shared/constantes.shared';

@Injectable()
export class DiretorService {

  constructor(private http: HttpClient) { }

  public inserir(diretor: Diretor, esc_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(CONSTANTES.N_HOST_API + 'diretor', { diretor, esc_id }, headers);
  }

  public listar(limit: number, offset: number, asc: boolean): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.get(CONSTANTES.N_HOST_API + `diretor/listar/${limit}/${offset}/${asc}`, headers);
  }

  public listarRegional(limit: number, offset: number, asc: boolean, esc_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.get(CONSTANTES.N_HOST_API + `diretor/listar-regional/${limit}/${offset}/${asc}/${esc_id}`, headers);
  }

  public listarLocal(limit: number, offset: number, asc: boolean, esc_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.get(CONSTANTES.N_HOST_API + `diretor/listar-local/${limit}/${offset}/${asc}/${esc_id}`, headers);
  }

  public alterar(diretor: Diretor): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.patch(CONSTANTES.N_HOST_API + "diretor", diretor, headers);
  }

  public excluir(id: number, foto: string, esc_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')), body: { id: id }
    };
    return this.http.delete(CONSTANTES.N_HOST_API + 'diretor', headers);
  }


  public filtrarLocal(
    valor: string, limit: number,
    offset: number, esc_id: number,
  ): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.get(CONSTANTES.N_HOST_API + `diretor/filtrar-local/${valor}/${limit}/${offset}/${esc_id}`, headers);
  }

  public filtrarRegional(
    valor: string, limit: number,
    offset: number, esc_id: number,
  ): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.get(CONSTANTES.N_HOST_API + `diretor/filtrar-regional/${valor}/${limit}/${offset}/${esc_id}`, headers);
  }

  public filtrar(
    valor: string,
    limit: number,
    offset: number,
  ): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.get(CONSTANTES.N_HOST_API + `diretor/filtrar/${valor}/${limit}/${offset}`, headers);
  }

  //######################################################################//



  /*
  limit: Quantidade de registros
  offset: Posição a partir da qual os registros serão exibitos
  asc: Se os registros virão em ordem ascendente ou decrescente
  */






  public listarSemEscola(): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'diretores-sem-escola',
      null,
      headers,
    );
  }

  public listarSemEscolaRegional(esc_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'diretores-sem-escola-regional',
      JSON.stringify({ esc_id: esc_id }),
      headers,
    );
  }

  public listarSemEscolaLocal(esc_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'diretores-sem-escola-local',
      JSON.stringify({ esc_id: esc_id }),
      headers,
    );
  }









  public enviarArquivo(arquivo: FileList): Observable<any> {
    const formData = new FormData();
    const options = {
      headers: new HttpHeaders().set(
        'Authorization',
        localStorage.getItem('token'),
      ),
    };

    formData.append('image', arquivo[0], arquivo[0].name);
    return this.http.post(
      CONSTANTES.HOST_API + 'enviar-avatar',
      formData,
      options,
    );
  }

}
