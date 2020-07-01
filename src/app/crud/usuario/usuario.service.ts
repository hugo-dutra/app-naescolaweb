import { Injectable } from '@angular/core';
import { Usuario } from './usuario.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONSTANTES } from '../../shared/constantes.shared';

@Injectable()
export class UsuarioService {
  public usuario = new Usuario();
  constructor(private http: HttpClient) { }


  public listarPorEscola(esc_id: number, todos: boolean): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.get(CONSTANTES.N_HOST_API + `usuario/por-escola-id/${esc_id}/${todos}`, headers);
  }

  public inserirSugestaoUsuario(sugestao: Object): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.post(CONSTANTES.N_HOST_API + 'susgestao-usuario', sugestao, headers);
  }

  public listarSugestaoUsuario(data_inicio: string, data_fim: string,
    esc_id: number, escopo: string, statusSugestao: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.get(CONSTANTES.N_HOST_API + `sugestao-usuario/${data_inicio}/${data_fim}/${esc_id}/${escopo}/${statusSugestao}`, headers,);
  }

  public alterarSugestaoUsuario(usrId: number, susId: number,
    observacao: string, statusSugestao: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.patch(CONSTANTES.N_HOST_API + 'sugestao-usuario', { usrId, susId, observacao, statusSugestao }, headers);
  }

  public listarHistoricoAlteracaoSugestaoUsuario(susId: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.get(CONSTANTES.N_HOST_API + `sugestao-usuario-historico/${susId}`, headers,);
  }

  public listarLocal(limit: number, offset: number, asc: boolean, esc_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.get(CONSTANTES.N_HOST_API + `usuario/local/${limit}/${offset}/${asc}/${esc_id}`, headers,);
  }

  public listarRegional(limit: number, offset: number, asc: boolean, esc_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.get(CONSTANTES.N_HOST_API + `usuario/regional/${limit}/${offset}/${asc}/${esc_id}`, headers,);
  }

  public listar(limit: number, offset: number, asc: boolean): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.get(CONSTANTES.N_HOST_API + `usuario/${limit}/${offset}/${asc}`, headers);
  }

  public filtrarLocal(valor: string, limit: number, offset: number, esc_id: number,): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.get(CONSTANTES.N_HOST_API + `usuario/filtrar-local/${valor}/${limit}/${offset}/${esc_id}`, headers);
  }

  public filtrarRegional(valor: string, limit: number, offset: number, esc_id: number,): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.get(CONSTANTES.N_HOST_API + `usuario/filtrar-regional/${valor}/${limit}/${offset}/${esc_id}`, headers,);
  }

  public filtrar(valor: string, limit: number, offset: number,): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.get(CONSTANTES.N_HOST_API + `usuario/filtrar/${valor}/${limit}/${offset}`, headers,);
  }

  public alterarStatusUsuario(use_id: number, status_ativo: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.post(CONSTANTES.N_HOST_API + `usuario-escola/alterar-status`, { use_id, status_ativo }, headers,);
  }

  public listarEscolaPerfilStatus(usr_id: number, esc_id: number, usr_id_solicitante: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.get(CONSTANTES.N_HOST_API + `usuario-escola/escola-perfil-status/${usr_id}/${esc_id}/${usr_id_solicitante}`, headers,);
  }


  public alterar(usuario: Usuario): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.patch(CONSTANTES.N_HOST_API + 'usuario', usuario, headers,);
  }


  public excluir(id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), body: { id } };
    return this.http.delete(CONSTANTES.N_HOST_API + 'usuario', headers,);
    //return this.http.post(CONSTANTES.HOST_API + 'excluir-usuario', JSON.stringify({ id: id }), headers,);
  }


  /********************************************************************************************************************************************************************/
  /********************************************************************************************************************************************************************/
  /********************************************************************************************************************************************************************/



  public inserir(usuario: Usuario): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'inserir-usuario',
      JSON.stringify(usuario),
      headers,
    );
  }


  public modificarSenha(usr_id: number, senha: string): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'modificar-senha-usuario',
      JSON.stringify({ usr_id: usr_id, senha: senha }),
      headers,
    );
  }


  public logar(nome: string, senha: string): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'logar-usuario',
      JSON.stringify({ nome: nome, senha: senha }),
      headers,
    );
  }


}
