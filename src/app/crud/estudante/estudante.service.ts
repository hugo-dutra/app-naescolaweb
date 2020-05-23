import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Estudante } from './estudante.model';
import { Observable } from 'rxjs';
import { CONSTANTES } from '../../shared/constantes.shared';
import { Telefone } from './telefone.estudante.model';
import { Utils } from '../../shared/utils.shared';

@Injectable()
export class EstudanteService {

  constructor(private http: HttpClient) { }

  public inserir(estudante: Estudante): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'inserir-estudante',
      JSON.stringify({ estudante: estudante }),
      headers,
    );
  }

  public desabilitarTurmaTransferido(listaEstId: Object[], esc_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'desabilitar-turma-estudante-transferido',
      JSON.stringify({ listaEstId: listaEstId, esc_id: esc_id }),
      headers,
    );
  }

  public inserirObservacao(
    usr_id: number,
    est_id: number,
    observacao: string,
  ): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'inserir-observacao-estudante',
      JSON.stringify({
        usr_id: usr_id,
        est_id: est_id,
        observacao: observacao,
      }),
      headers,
    );
  }

  public listarObservacao(est_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'listar-observacao-estudante-id',
      JSON.stringify({ est_id: est_id }),
      headers,
    );
  }

  public listarDadosTurma(est_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };

    return this.http.post(
      CONSTANTES.HOST_API + 'listar-dados-turma-estudante',
      JSON.stringify({ est_id: est_id }),
      headers,
    );
  }

  public listarDetalhesInformacoes(est_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };

    return this.http.post(
      CONSTANTES.HOST_API + 'listar-detalhar-informacao-estudante',
      JSON.stringify({ est_id: est_id }),
      headers,
    );
  }

  public listarDetalhesNotificacoes(est_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'listar-historico-entrega-notificacao-estudante',
      JSON.stringify({ est_id: est_id }),
      headers,
    );
  }

  public excluirObservacao(id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'excluir-observacao-estudante',
      JSON.stringify({ id: id }),
      headers,
    );
  }

  public validarMatricula(matricula: string): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'validar-matricula-estudante',
      JSON.stringify({ matricula: matricula }),
      headers,
    );
  }

  public alterarObservacao(
    id: number,
    usr_id: number,
    observacao: string,
  ): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };

    return this.http.post(
      CONSTANTES.HOST_API + 'alterar-observacao-estudante',
      JSON.stringify({ id: id, usr_id: usr_id, observacao: observacao }),
      headers,
    );
  }

  public alterarTurma(
    estudantes: Object[],
    trm_id: number,
  ): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'alterar-turma-estudante',
      JSON.stringify({ estudantes: estudantes, trm_id: trm_id }),
      headers,
    );
  }

  public alterarEscola(
    estudantes: Object[],
    esc_id: number,
  ): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'alterar-escola-estudante',
      JSON.stringify({ estudantes: estudantes, esc_id: esc_id }),
      headers,
    );
  }

  /** Método que atualiza a foto do estudante
   * @param matricula Matrícula do estudante
   * @param link Link para foto
   * @param sobrescrever Se valor for 1, a foto anterior será reescrita. Se for zero,
   * a foto existente não será reescrita.
   */
  public alterarFoto(
    matricula: string,
    link: number,
    sobrescrever: number,
  ): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };

    return this.http.post(
      CONSTANTES.HOST_API + 'alterar-foto-estudantes',
      JSON.stringify({ matricula: matricula, link: link, sobrescrever: sobrescrever }),
      headers,
    );
  }

  public alterarFotosEstudantesAplicativoAdministrativo(fotosEstudantes: Object[],
    sobrescreverFoto: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'alterar-foto-estudantes-aplicativo-administrativo',
      JSON.stringify({ fotosEstudantes: fotosEstudantes, sobrescreverFoto: sobrescreverFoto }),
      headers,
    );
  }


  public inserirTelefones(telefones: Array<Telefone>): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };

    return this.http.post(
      CONSTANTES.HOST_API + 'inserir-telefone-estudante',
      JSON.stringify({ telefones: telefones }),
      headers,
    );
  }

  public alterar(estudante: Estudante): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };

    return this.http.post(
      CONSTANTES.HOST_API + 'alterar-estudante',
      JSON.stringify({ estudante: estudante }),
      headers,
    );
  }

  public excluir(id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };

    return this.http.post(
      CONSTANTES.HOST_API + 'excluir-estudante',
      JSON.stringify({ id: id }),
      headers,
    );
  }

  public excluirTelefones(est_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };

    return this.http.post(
      CONSTANTES.HOST_API + 'excluir-telefone-estudante',
      JSON.stringify({ est_id: est_id }),
      headers,
    );
  }


  public listarEstudantesAplicativo(esc_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'listar-estudante-aplicativo',
      JSON.stringify({
        esc_id: esc_id,
      }),
      headers,
    );
  }

  public listar(
    limit: number,
    offset: number,
    asc: boolean,
    esc_id: number,
  ): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };

    return this.http.post(
      CONSTANTES.HOST_API + 'estudantes',
      JSON.stringify({
        limit: limit,
        offset: offset,
        asc: asc,
        esc_id: esc_id,
      }),
      headers,
    );
  }

  public listarPorRegional(
    limit: number, offset: number,
    asc: boolean, esc_id: number,
  ): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'estudantes-regional',
      JSON.stringify({
        limit: limit,
        offset: offset,
        asc: asc,
        esc_id: esc_id,
      }),
      headers,
    );
  }

  public listarGlobal(
    limit: number, offset: number,
    asc: boolean,
  ): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'estudantes-global',
      JSON.stringify({
        limit: limit,
        offset: offset,
        asc: asc,
      }),
      headers,
    );
  }

  public listarSemFoto(
    esc_id: number,
    ano: number,
  ): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };

    return this.http.post(
      CONSTANTES.HOST_API + 'listar-estudantes-sem-foto',
      JSON.stringify({
        esc_id: esc_id,
        ano: ano,
      }),
      headers,
    );
  }

  public enviarArquivoExcel(arquivo: FileList): Observable<any> {
    const formData = new FormData();
    const options = {
      headers: new HttpHeaders().set(
        'Authorization',
        localStorage.getItem('token'),
      ),
    };

    formData.append('Content-Type', 'multipart/form-dat');
    formData.append(arquivo[0].name, arquivo[0]);
    formData.append('esc_id', Utils.pegarDadosEscola()['id']);
    return this.http.post(
      CONSTANTES.HOST_API + 'enviar-arquivo-excel',
      formData,
      options,
    );
  }

  public inserirViaListagem(estudantes: any[]): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'inserir-estudante-via-listagem',
      JSON.stringify({ estudantes: estudantes }),
      headers,
    );
  }


  public integracaoInserir(estudantes: Object[], esc_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(CONSTANTES.N_HOST_API + `estudante/integracao/${esc_id}`, estudantes, headers);
  }



  public listarTurmaId(trm_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };

    return this.http.post(
      CONSTANTES.HOST_API + 'estudantes-turma-id',
      JSON.stringify({ trm_id: trm_id }),
      headers,
    );
  }

  public listarTurnoId(trn_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };

    return this.http.post(
      CONSTANTES.HOST_API + 'estudantes-turno-id',
      JSON.stringify({ trn_id: trn_id }),
      headers,
    );
  }

  public alterarManualNumeroChamada(est_id: number, trm_id: number, numero_chamada: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };

    return this.http.post(
      CONSTANTES.HOST_API + 'alterar-manual-numero-chamada-estudante',
      JSON.stringify({ est_id: est_id, trm_id: trm_id, numero_chamada: numero_chamada }),
      headers,
    );
  }

  public listarTurmaEscolaId(esc_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };

    return this.http.post(
      CONSTANTES.HOST_API + 'estudantes-turma-escola-id',
      JSON.stringify({ esc_id: esc_id }),
      headers,
    );
  }

  public listarSemFotoEscolaId(esc_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };

    return this.http.post(
      CONSTANTES.HOST_API + 'listar-estudantes-sem-foto',
      JSON.stringify({ esc_id: esc_id }),
      headers,
    );
  }



  public listarTelefones(id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };

    return this.http.post(
      CONSTANTES.HOST_API + 'telefones-estudante',
      JSON.stringify({ id: id }),
      headers,
    );
  }

  public enturmar(estudantes: Array<number>, trm_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };

    return this.http.post(
      CONSTANTES.HOST_API + 'enturmar',
      JSON.stringify({ estudantes: estudantes, trm_id: trm_id }),
      headers,
    );
  }

  public enturmarViaImportacao(estudantes: Array<any>): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'enturmar-estudante-via-importacao',
      JSON.stringify({ estudantes: estudantes }),
      headers,
    );
  }

  public integracaoEnturmar(estudantes: Object[]): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'integracao-enturmar',
      JSON.stringify({ estudantes: estudantes }),
      headers,
    );
  }

  public listarSemTurma(esc_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };

    return this.http.post(
      CONSTANTES.HOST_API + 'listar-sem-turma',
      JSON.stringify({ esc_id: esc_id }),
      headers,
    );
  }

  public filtrar(
    valor: string,
    limit: number,
    offset: number,
    esc_id: number,
  ): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'filtrar-estudante',
      JSON.stringify({
        valor: valor,
        limit: limit,
        offset: offset,
        esc_id: esc_id,
      }),
      headers,
    );
  }

  public listarStatusEntregaMensagensEnviadas(est_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'listar-status-entrega-mensagens-enviadas',
      JSON.stringify({ est_id: est_id }), headers);
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
      CONSTANTES.HOST_API + 'filtrar-estudante-regional',
      JSON.stringify({
        valor: valor,
        limit: limit,
        offset: offset,
        esc_id: esc_id,
      }),
      headers,
    );
  }

  public filtrarGlobal(
    valor: string,
    limit: number,
    offset: number,
  ): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'filtrar-estudante-global',
      JSON.stringify({
        valor: valor,
        limit: limit,
        offset: offset,
      }),
      headers,
    );
  }

  public filtrarContaOcorrencia(
    valor: string,
    limit: number,
    offset: number,
    esc_id: number,
  ): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };

    return this.http.post(
      CONSTANTES.HOST_API + 'filtrar-estudante-com-ocorrencia',
      JSON.stringify({
        valor: valor,
        limit: limit,
        offset: offset,
        esc_id: esc_id,
      }),
      headers,
    );
  }

  public consultarCEP(cep: string): Observable<any> {
    return this.http.get(`https://viacep.com.br/ws/${cep}/json/`);
  }

}
