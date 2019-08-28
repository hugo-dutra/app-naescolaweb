import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DiarioRegistro } from './diario-registro.model';
import { Observable } from 'rxjs';
import { CONSTANTES } from '../../shared/constantes.shared';
import { DiarioAvaliacao } from './diario-avaliacao-model';
import * as Excel from "exceljs/dist/exceljs.min.js";
import * as ExcelProper from "exceljs";

@Injectable({
  providedIn: 'root'
})
export class DiarioRegistroService {

  public modeloPlanilhaImportarNotasBoletim: ExcelProper.Workbook = new Excel.Workbook();

  constructor(private http: HttpClient) { }

  public inserir(diarioRegistro: DiarioRegistro): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "inserir-diario-registro",
      JSON.stringify({ diarioRegistro: diarioRegistro }),
      headers
    );
  }

  public alterar(rdi_id: number, conteudo: string, data_registro: string): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "alterar-diario-registro",
      JSON.stringify({
        rdi_id: rdi_id,
        conteudo: conteudo,
        data_registro: data_registro
      }),
      headers
    );
  }

  public gravarNotasImportacaoPlanilha(prl_id: number, resultadosEstudante: any[], anoLetivo: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "gravar-notas-importacao-planilha",
      JSON.stringify({ prl_id: prl_id, resultadosEstudante: resultadosEstudante, anoLetivo: anoLetivo }),
      headers
    );
  }

  public integracaoGravarNotasImportacao(resultadosEstudante: Object[], anoLetivo: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "integracao-gravar-notas",
      JSON.stringify({ resultadosEstudante: resultadosEstudante, anoLetivo: anoLetivo }),
      headers
    );
  }

  public gravarLancamentoPeriodoLetivoManual(notasFaltasEstudante: Object[]): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "inserir-lancamento-periodo-letivo-manual",
      JSON.stringify({ notasFaltasEstudante: notasFaltasEstudante }),
      headers
    );
  }

  public listar(dip_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "listar-diario-registro",
      JSON.stringify({ dip_id: dip_id }),
      headers
    );
  }

  public listarFrequencia(rdi_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "listar-frequencia-diario-registro",
      JSON.stringify({ rdi_id: rdi_id }),
      headers
    );
  }

  public alterarFrequencia(ref_id: number, presente: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "alterar-frequencia-diario-registro",
      JSON.stringify({
        ref_id: ref_id,
        presente: presente
      }),
      headers
    );
  }

  public inserirAvaliacaoTurmaEstudantes(diarioAvaliacao: DiarioAvaliacao): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "inserir-avaliacao-diario-registro",
      JSON.stringify({
        diarioAvaliacao: diarioAvaliacao
      }),
      headers
    );
  }

  public alterarAvaliacaoTurmaEstudantes(diarioAvaliacao: DiarioAvaliacao): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(CONSTANTES.HOST_API + "alterar-avaliacao-diario-registro", JSON.stringify({ diarioAvaliacao: diarioAvaliacao }), headers);
  }

  public listarAvaliacaoDiarioProfessor(dip_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "listar-avaliacao-diario-registro",
      JSON.stringify({
        dip_id: dip_id
      }),
      headers
    );
  }

  public listarAvaliacaoEstudanteDiarioAvaliacao(dav_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "listar-avaliacao-estudante-diario-registro",
      JSON.stringify({
        dav_id: dav_id
      }),
      headers
    );
  }

}
