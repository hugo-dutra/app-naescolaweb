import { Injectable } from '@angular/core';
import { Acesso } from './acesso.model';
import { LinkAcessado } from './link-acessado.model';
import { Utils } from '../utils.shared';
import { CONSTANTES } from '../constantes.shared';

@Injectable({
  providedIn: 'root'
})
export class AcessoComumService {

  private usr_id: number;
  private esc_id: number;
  private acesso = new Acesso();

  public adicionarLinkAcessado(linkAcessado: LinkAcessado): void {
    this.usr_id = Utils.verificarDados()[0]["id"];
    this.esc_id = parseInt(Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT));
    this.acesso.usr_id = this.usr_id;

    if (JSON.parse(localStorage.getItem(`favoritos_${this.esc_id}_${this.usr_id}`)) != null) {
      this.acesso = JSON.parse(localStorage.getItem(`favoritos_${this.esc_id}_${this.usr_id}`)
      );
    }
    if (this.validarNovoLink(this.acesso.arrayOfAcessos, linkAcessado)) {
      this.acesso.arrayOfAcessos.push(linkAcessado);
    }
    this.contarLinksAcessados(this.acesso.arrayOfAcessos, linkAcessado);
    localStorage.setItem(`favoritos_${this.esc_id}_${this.usr_id}`, JSON.stringify(this.acesso));
  }

  public listarFavoritos(): Acesso {
    this.usr_id = Utils.verificarDados()[0]["id"];
    this.esc_id = parseInt(Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT));
    this.acesso.usr_id = this.usr_id;

    if (JSON.parse(localStorage.getItem(`favoritos_${this.esc_id}_${this.usr_id}`)) != null) {
      this.acesso = JSON.parse(localStorage.getItem(`favoritos_${this.esc_id}_${this.usr_id}`)
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
