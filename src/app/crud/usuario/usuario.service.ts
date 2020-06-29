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

  public inserirSugestaoUsuario(sugestao: Object): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'inserir-sugestao-usuario',
      JSON.stringify(sugestao),
      headers,
    );
  }

  public alterarSugestaoUsuario(usrId: number, susId: number,
    observacao: string, statusSugestao: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };

    return this.http.post(
      CONSTANTES.HOST_API + 'alterar-sugestao-usuario',
      JSON.stringify({ usr_id: usrId, sus_id: susId, observacao: observacao, statusSugestao: statusSugestao }),
      headers,
    );
  }

  public listarHistoricoAlteracaoSugestaoUsuario(susId: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };

    return this.http.post(
      CONSTANTES.HOST_API + 'listar-historico-alteracao-sugestao-usuario',
      JSON.stringify({ sus_id: susId }),
      headers,
    );
  }

  public listarSugestaoUsuario(data_inicio: string, data_fim: string,
    esc_id: number, escopo: string, statusSugestao: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'listar-sugestao-usuario',
      JSON.stringify({
        data_inicio: data_inicio,
        data_fim: data_fim,
        est_id: esc_id,
        escopo: escopo,
        statusSugestao: statusSugestao,
      }),
      headers,
    );
  }

  public alterar(usuario: Usuario): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'alterar-usuario',
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

  public excluir(id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'excluir-usuario',
      JSON.stringify({ id: id }),
      headers,
    );
  }

  public listar(limit: number, offset: number, asc: boolean): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'usuarios',
      JSON.stringify({ limit: limit, offset: offset, asc: asc }),
      headers,
    );
  }

  public listarRegional(limit: number, offset: number, asc: boolean, esc_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'usuarios-regional',
      JSON.stringify({ limit: limit, offset: offset, asc: asc, esc_id: esc_id }),
      headers,
    );
  }

  public listarLocal(limit: number, offset: number, asc: boolean, esc_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'usuarios-local',
      JSON.stringify({ limit: limit, offset: offset, asc: asc, esc_id: esc_id }),
      headers,
    );
  }

  public alterarStatusUsuario(use_id: number, status_ativo: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'alterar-status-usuario-ativo',
      JSON.stringify({ use_id: use_id, status_ativo: status_ativo }),
      headers,
    );
  }

  public listarEscolaPerfilStatus(usr_id: number, esc_id: number, usr_id_solicitante: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'listar-escola-perfil-status',
      JSON.stringify({ usr_id: usr_id, esc_id: esc_id, usr_id_solicitante: usr_id_solicitante }),
      headers,
    );
  }

  public listarSemEscola(): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'usuarios-sem-escola',
      null,
      headers,
    );
  }



  public filtrar(
    valor: string, limit: number,
    offset: number,
  ): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'filtrar-usuario',
      JSON.stringify({ valor: valor, limit: limit, offset: offset }),
      headers,
    );
  }

  public filtrarRegional(
    valor: string, limit: number,
    offset: number, esc_id: number,
  ): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'filtrar-usuario-regional',
      JSON.stringify({ valor: valor, limit: limit, offset: offset, esc_id: esc_id }),
      headers,
    );
  }

  public filtrarLocal(
    valor: string, limit: number,
    offset: number, esc_id: number,
  ): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'filtrar-usuario-local',
      JSON.stringify({ valor: valor, limit: limit, offset: offset, esc_id: esc_id }),
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
      CONSTANTES.HOST_API + 'enviar-avatar-usuario',
      formData,
      options,
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
