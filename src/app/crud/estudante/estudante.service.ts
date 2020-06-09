import { Injectable, ɵConsole } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Estudante } from './estudante.model';
import { Observable } from 'rxjs';
import { CONSTANTES } from '../../shared/constantes.shared';
import { Telefone } from './telefone.estudante.model';
import { Utils } from '../../shared/utils.shared';

@Injectable()
export class EstudanteService {

  constructor(private http: HttpClient) { }

  public integracaoInserir(estudantes: Object[], esc_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(CONSTANTES.N_HOST_API + `estudante/integracao/${esc_id}`, estudantes, headers);
  }

  public integracaoEnturmar(estudantes: Object[], esc_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(CONSTANTES.N_HOST_API + 'estudante-turma/enturmar/integracao', { estudantes, esc_id }, headers);
  }

  public desabilitarTurmaTransferido(listaEstId: Object[], esc_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(CONSTANTES.N_HOST_API + 'estudante-turma/desabilitar-turma-estudante-transferido', { listaEstId, esc_id }, headers);
  }

  public inserir(estudante: Estudante): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(CONSTANTES.N_HOST_API + 'estudante', estudante, headers);
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
    return this.http.get(CONSTANTES.N_HOST_API + `estudante/listar-local/${limit}/${offset}/${asc}/${esc_id}`, headers);
  }

  public listarPorRegional(
    limit: number, offset: number,
    asc: boolean, esc_id: number,
  ): Observable<any> {

    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.get(CONSTANTES.N_HOST_API + `estudante/listar-regional/${limit}/${offset}/${asc}/${esc_id}`, headers);
  }

  public listarGlobal(
    limit: number, offset: number,
    asc: boolean,
  ): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.get(CONSTANTES.N_HOST_API + `estudante/listar-global/${limit}/${offset}/${asc}`, headers);
  }


  public filtrar(
    valor: string, limit: number,
    offset: number, esc_id: number,
  ): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.get(CONSTANTES.N_HOST_API + `estudante/filtrar-local/${valor}/${limit}/${offset}/${esc_id}`, headers);
  }

  public filtrarRegional(
    valor: string, limit: number,
    offset: number, esc_id: number,
  ): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.get(CONSTANTES.N_HOST_API + `estudante/filtrar-regional/${valor}/${limit}/${offset}/${esc_id}`, headers);
  }

  public filtrarGlobal(
    valor: string, limit: number, offset: number,
  ): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.get(CONSTANTES.N_HOST_API + `estudante/filtrar-global/${valor}/${limit}/${offset}`, headers);
  }

  public inserirObservacao(
    usr_id: number, est_id: number, observacao: string,
  ): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(CONSTANTES.N_HOST_API + 'observacao-estudante', { usr_id: usr_id, est_id: est_id, observacao: observacao }, headers);
  }

  public listarObservacao(est_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.get(CONSTANTES.N_HOST_API + `observacao-estudante/${est_id}`, headers);
  }

  public alterarObservacao(
    id: number, usr_id: number, observacao: string,
  ): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.patch(CONSTANTES.N_HOST_API + 'observacao-estudante', { id: id, usr_id: usr_id, observacao: observacao }, headers);
  }

  public excluirObservacao(id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')), body: { id: id }
    };
    return this.http.delete(CONSTANTES.N_HOST_API + 'observacao-estudante', headers);
  }

  public listarDadosTurma(est_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.get(CONSTANTES.N_HOST_API + `estudante-turma/serie-turma-turno-etapa/${est_id}`, headers);
  }


  public listarTelefones(id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.get(CONSTANTES.N_HOST_API + `telefone-contato-estudante/${id}`, headers);
  }

  public inserirTelefones(telefones: Array<Telefone>): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(CONSTANTES.N_HOST_API + 'telefone-contato-estudante', telefones, headers);
  }

  public alterar(estudante: Estudante): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.patch(CONSTANTES.N_HOST_API + 'estudante', estudante, headers);
  }

  public excluirTelefones(est_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')), body: { est_id: est_id }
    };
    return this.http.delete(CONSTANTES.N_HOST_API + 'telefone-contato-estudante', headers);
  }

  public excluir(id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')), body: { est_id: id }
    };
    return this.http.delete(CONSTANTES.N_HOST_API + 'estudante', headers);
  }

  public alterarTurma(
    estudantes: Object[],
    trm_id: number,
  ): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.patch(CONSTANTES.N_HOST_API + 'estudante-turma', { estudantes: estudantes, trm_id: trm_id }, headers);
  }

  public listarTurmaId(trm_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.get(CONSTANTES.N_HOST_API + `estudante/turma-id/${trm_id}`, headers);
  }

  public alterarEscola(
    estudantes: Object[], esc_id: number
  ): Observable<any> {
    console.log(estudantes, esc_id)
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.patch(CONSTANTES.N_HOST_API + 'estudante/alterar-escola', { estudantes: estudantes, esc_id: esc_id }, headers);
  }


  public validarMatricula(matricula: string): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.get(CONSTANTES.N_HOST_API + `estudante/validar-matricula/${matricula}`, headers);
  }

  public listarSemFotoEscolaId(esc_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.get(CONSTANTES.N_HOST_API + `estudante/sem-foto/${esc_id}`, headers);
  }

  public listarTurnoId(trn_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.get(CONSTANTES.N_HOST_API + `estudante/turno-id/${trn_id}`, headers);
  }

  public listarSemTurma(esc_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.get(CONSTANTES.N_HOST_API + `estudante/sem-turma/${esc_id}`, headers);
  }

  public listarEstudantesAplicativo(esc_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.get(CONSTANTES.N_HOST_API + `estudante/listar-aplicativo/${esc_id}`, headers);
  }

  public inserirViaListagem(estudantes: any[]): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(CONSTANTES.N_HOST_API + 'estudante/via-listagem', estudantes, headers);
  }

  public enturmarViaImportacao(estudantes: Array<any>): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(CONSTANTES.N_HOST_API + 'estudante-turma/enturmar/via-importacao', estudantes, headers);
  }

  public alterarManualNumeroChamada(est_id: number, trm_id: number, numero_chamada: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(CONSTANTES.N_HOST_API + 'estudante-turma/alterar-manual-numero-chamada', { est_id: est_id, trm_id: trm_id, numero_chamada: numero_chamada }, headers);
  }

  public alterarFotosEstudantesAplicativoAdministrativo(fotosEstudantes: Object[], sobrescreverFoto: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(CONSTANTES.N_HOST_API + 'estudante/alterar-foto-aplicativo-administrativo', { fotosEstudantes, sobrescreverFoto }, headers);
  }

  public listarTurmaEscolaId(esc_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.get(CONSTANTES.N_HOST_API + `estudante/turma-escola-id/${esc_id}`, headers);
  }

  public enturmar(estudantes: Array<number>, trm_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(CONSTANTES.N_HOST_API + 'estudante-turma/enturmar', { estudantes: estudantes, trm_id: trm_id }, headers);
  }


  public consultarCEP(cep: string): Observable<any> {
    return this.http.get(`https://viacep.com.br/ws/${cep}/json/`);
  }

  /*################################################################################################################*/
  /*################################################################################################################*/
  /*################################################################################################################*/

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

  /* Pesquisar como ler arquivo em excel no node/nestjs */
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

  public listarStatusEntregaMensagensEnviadas(est_id: number): Observable<any> {
    const headers = {
      headers: new HttpHeaders().append('Content-type', 'application/json')
        .append('Authorization', localStorage.getItem('token')),
    };
    return this.http.post(
      CONSTANTES.HOST_API + 'listar-status-entrega-mensagens-enviadas',
      JSON.stringify({ est_id: est_id }), headers);
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


}
