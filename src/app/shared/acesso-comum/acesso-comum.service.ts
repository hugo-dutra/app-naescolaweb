import { Injectable, EventEmitter } from '@angular/core';
import { Acesso } from './acesso.model';
import { LinkAcessado } from './link-acessado.model';
import { Utils } from '../utils.shared';
import { CONSTANTES } from '../constantes.shared';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AcessoComumService {
  emitirAlertaOcorrenciaDisciplinar = new EventEmitter<Object[]>();
  emitirAlertaInicioTour = new EventEmitter<Object[]>();
  emitirAlertaExibirIconeAjuda = new EventEmitter<boolean>();
  emitirAlertaLogout = new EventEmitter<boolean>();

  public constructor(private http: HttpClient = null) {

  }

  private usr_id: number;
  private esc_id: number;
  private acesso = new Acesso();

  public pegarConfiguracaoFirebase(): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')), };
    return this.http.get(CONSTANTES.N_HOST_API + 'sistema/pcf', headers);
  }

  public adicionarLinkAcessado(linkAcessado: LinkAcessado): void {
    this.usr_id = Utils.verificarDados()[0]['id'];
    this.esc_id = parseInt(Utils.decriptAtoB(localStorage.getItem('esc_id'), CONSTANTES.PASSO_CRIPT), 10);
    this.acesso.usr_id = this.usr_id;

    if (JSON.parse(localStorage.getItem(`favoritos_${this.esc_id}_${this.usr_id}`)) != null) {
      this.acesso = JSON.parse(localStorage.getItem(`favoritos_${this.esc_id}_${this.usr_id}`),
      );
    }
    if (this.validarNovoLink(this.acesso.arrayOfAcessos, linkAcessado)) {
      this.acesso.arrayOfAcessos.push(linkAcessado);
    }
    this.contarLinksAcessados(this.acesso.arrayOfAcessos, linkAcessado);
    localStorage.setItem(`favoritos_${this.esc_id}_${this.usr_id}`, JSON.stringify(this.acesso));
  }

  public listarFavoritos(): Acesso {
    if (Utils.verificarDados() != null && localStorage.getItem('esc_id') != null) {
      this.usr_id = Utils.verificarDados()[0]['id'];
      this.acesso.usr_id = this.usr_id;
      this.esc_id = parseInt(Utils.decriptAtoB(localStorage.getItem('esc_id'), CONSTANTES.PASSO_CRIPT), 10);
    }
    if (JSON.parse(localStorage.getItem(`favoritos_${this.esc_id}_${this.usr_id}`)) != null) {
      this.acesso = JSON.parse(localStorage.getItem(`favoritos_${this.esc_id}_${this.usr_id}`),
      );
    }
    return this.acesso;
  }

  public validarNovoLink(linksAcessados: LinkAcessado[], link: LinkAcessado): boolean {
    for (let i = 0; i < linksAcessados.length; i++) {
      if (link.link == linksAcessados[i].link) {
        return false;
      }
    }
    return true;
  }

  public contarLinksAcessados(linksAcessados: LinkAcessado[], link: LinkAcessado): Array<LinkAcessado> {
    let linksAcessadosAtualizados: Array<LinkAcessado>;
    for (let i = 0; i < linksAcessados.length; i++) {
      if (link.link == linksAcessados[i].link) {
        linksAcessados[i].quantidadeAcessoLink += 1;
      }
    }
    linksAcessadosAtualizados = linksAcessados;
    return linksAcessadosAtualizados;
  }
}
