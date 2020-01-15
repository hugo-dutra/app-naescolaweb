import { Injectable } from '@angular/core';
import { Usuario } from './usuario.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONSTANTES } from '../../shared/constantes.shared';

@Injectable()
export class UsuarioService {
  public usuario = new Usuario();
  constructor(private http: HttpClient) { }

  public inserir(usuario: Usuario): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "inserir-usuario",
      JSON.stringify(usuario),
      headers
    );
  }

  public alterar(usuario: Usuario): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "alterar-usuario",
      JSON.stringify(usuario),
      headers
    );
  }

  public modificarSenha(usr_id: number, senha: string): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "modificar-senha-usuario",
      JSON.stringify({ usr_id: usr_id, senha: senha }),
      headers
    );
  }

  public excluir(id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "excluir-usuario",
      JSON.stringify({ id: id }),
      headers
    );
  }

  public listar(limit: number, offset: number, asc: boolean): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "usuarios",
      JSON.stringify({ limit: limit, offset: offset, asc: asc }),
      headers
    );
  }

  public listarRegional(limit: number, offset: number, asc: boolean, esc_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "usuarios-regional",
      JSON.stringify({ limit: limit, offset: offset, asc: asc, esc_id: esc_id }),
      headers
    );
  }

  public listarLocal(limit: number, offset: number, asc: boolean, esc_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "usuarios-local",
      JSON.stringify({ limit: limit, offset: offset, asc: asc, esc_id: esc_id }),
      headers
    );
  }

  public alterarStatusUsuario(use_id: number, status_ativo: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "alterar-status-usuario-ativo",
      JSON.stringify({ use_id: use_id, status_ativo: status_ativo }),
      headers
    );
  }

  public listarEscolaPerfilStatus(usr_id: number, esc_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "listar-escola-perfil-status",
      JSON.stringify({ usr_id: usr_id, esc_id: esc_id }),
      headers
    );
  }

  public listarSemEscola(): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "usuarios-sem-escola",
      null,
      headers
    );
  }

  public listarPorEscola(esc_id: number, todos: boolean): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "usuarios-por-escola-id",
      JSON.stringify({ esc_id: esc_id, todos: todos }),
      headers
    );
  }

  public filtrar(
    valor: string, limit: number,
    offset: number
  ): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "filtrar-usuario",
      JSON.stringify({ valor: valor, limit: limit, offset: offset }),
      headers
    );
  }

  public filtrarRegional(
    valor: string, limit: number,
    offset: number, esc_id: number
  ): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "filtrar-usuario-regional",
      JSON.stringify({ valor: valor, limit: limit, offset: offset, esc_id: esc_id }),
      headers
    );
  }

  public filtrarLocal(
    valor: string, limit: number,
    offset: number, esc_id: number
  ): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "filtrar-usuario-local",
      JSON.stringify({ valor: valor, limit: limit, offset: offset, esc_id: esc_id }),
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
      CONSTANTES.HOST_API + "enviar-avatar-usuario",
      formData,
      options
    );
  }

  public logar(nome: string, senha: string): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(
      CONSTANTES.HOST_API + "logar-usuario",
      JSON.stringify({ nome: nome, senha: senha }),
      headers
    );
  }
}
