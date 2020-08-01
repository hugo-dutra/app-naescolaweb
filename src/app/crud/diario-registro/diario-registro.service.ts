import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DiarioRegistro } from './diario-registro.model';
import { Observable } from 'rxjs';
import { CONSTANTES } from '../../shared/constantes.shared';
import { DiarioAvaliacao } from './diario-avaliacao-model';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as ExcelProper from 'exceljs';

@Injectable({
  providedIn: 'root',
})
export class DiarioRegistroService {

  public modeloPlanilhaImportarNotasBoletim: ExcelProper.Workbook = new Excel.Workbook();

  constructor(private http: HttpClient) { }

  public inserir(diarioRegistro: DiarioRegistro): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')) };
    return this.http.post(CONSTANTES.N_HOST_API + 'registro-diario', diarioRegistro, headers);
  }

  public listar(dip_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.get(CONSTANTES.N_HOST_API + `registro-diario/${dip_id}`, headers);
  }

  public listarFrequencia(rdi_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.get(CONSTANTES.N_HOST_API + `registro-frequencia/${rdi_id}`, headers,);
  }

  public alterar(rdi_id: number, conteudo: string, data_registro: string): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.patch(CONSTANTES.N_HOST_API + 'registro-diario', { rdi_id: rdi_id, conteudo: conteudo, data_registro: data_registro }, headers,);
  }

  public alterarFrequencia(ref_id: number, presente: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.patch(CONSTANTES.N_HOST_API + 'registro-frequencia', { ref_id, presente }, headers,);
  }

  public gravarNotasImportacaoPlanilha(prl_id: number, resultadosEstudante: any[], anoLetivo: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.post(CONSTANTES.N_HOST_API + `boletim-escolar/gravar-notas-planilha`, { prl_id: prl_id, resultadosEstudante: resultadosEstudante, anoLetivo: anoLetivo }, headers);
  }

  public gravarLancamentoPeriodoLetivoManual(notasFaltasEstudante: Object[]): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.post(CONSTANTES.N_HOST_API + 'boletim-escolar/lancamento-periodo-letivo-manual', notasFaltasEstudante, headers,);
  }

  public inserirAvaliacaoTurmaEstudantes(diarioAvaliacao: DiarioAvaliacao): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.post(CONSTANTES.N_HOST_API + 'diario-avaliacao/avaliacao-diario-registro', diarioAvaliacao, headers,);
  }

  public listarAvaliacaoDiarioProfessor(dip_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')) };
    return this.http.get(CONSTANTES.N_HOST_API + `diario-avaliacao/avaliacao-diario-registro/${dip_id}`, headers);
  }

  public listarAvaliacaoEstudanteDiarioAvaliacao(dav_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.get(CONSTANTES.N_HOST_API + `avaliacao-estudante/diario-registro/${dav_id}`, headers);
  }

  public alterarAvaliacaoTurmaEstudantes(diarioAvaliacao: DiarioAvaliacao): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.patch(CONSTANTES.N_HOST_API + 'diario-avaliacao/avaliacao-diario-registro', diarioAvaliacao, headers);
  }

  public integracaoGravarNotasImportacao(resultadosEstudante: Object[], anoLetivo: number): Observable<any> {
    alert('Baixar notas da integração');
    return null;
    // IMPLEMENTAR NA INTEGRAÇÃO COM O OUTRO SISTEMA.
    /* const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.post(CONSTANTES.N_HOST_API + 'integracao-gravar-notas', JSON.stringify({ resultadosEstudante: resultadosEstudante, anoLetivo: anoLetivo }), headers,); */
  }












}
