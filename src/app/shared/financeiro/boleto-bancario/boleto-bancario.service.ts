import { Injectable } from "@angular/core";
import { Cobranca } from "./cobranca.model";
import { CONSTANTES } from "../../constantes.shared";
import { Observable } from "rxjs";
import { BoletoBancario } from "./boleto-bancario.model";
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class BoletoBancarioService {
  constructor(private http: HttpClient) { }

  public gerarBoletoBancario(cobranca: Cobranca): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json") }

    return this.http.post(
      CONSTANTES.BOLETO_FACIL_URL_BASE +
      cobranca.token +
      "&amount=" +
      cobranca.amount +
      "&description=" +
      cobranca.description +
      "&maxOverdueDays=" +
      cobranca.maxOverdueDays +
      "&notifyPayer=" +
      cobranca.notifyPayer +
      "&payerCpfCnpj=" +
      cobranca.payerCpfCnpj +
      "&payerEmail=" +
      cobranca.payerEmail +
      "&payerName=" +
      cobranca.payerName +
      "&dueDate=" +
      cobranca.dueDate +
      "&discountAmount=" +
      cobranca.discountAmount +
      "&discountDays=" +
      cobranca.discountDays,
      null,
      headers
    );
  }

  public salvarBoletoBancario(boleto: BoletoBancario, esc_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "inserir-boleto-mensalidade",
      JSON.stringify({ boleto: boleto, esc_id: esc_id }),
      headers
    );
  }

  public salvarBoletoBancarioPedidoCartao(boleto: BoletoBancario, pec_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "inserir-boleto-pedido-cartao",
      JSON.stringify({ boleto: boleto, pec_id: pec_id }),
      headers
    );
  }

  public listarBoletoAnoEscolaId(ano: number, esc_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }

    return this.http.post(
      CONSTANTES.HOST_API + "listar-boleto-ano-escola-id",
      JSON.stringify({ ano: ano, esc_id: esc_id }),
      headers
    );
  }



}
