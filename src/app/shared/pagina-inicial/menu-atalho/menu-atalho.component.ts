// tslint:disable: triple-equals
import { Component, OnInit } from '@angular/core';
import { AcessoComumService } from '../../acesso-comum/acesso-comum.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../constantes.shared';
import { Acesso } from '../../acesso-comum/acesso.model';
import { LinkAcessado } from '../../acesso-comum/link-acessado.model';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-menu-atalho',
  templateUrl: './menu-atalho.component.html',
  styleUrls: ['./menu-atalho.component.scss'],
  providers: [AcessoComumService],
  animations: [
    trigger('chamado', [
      state(
        'visivel',
        style({
          opacity: 1,
          transform: 'scale(1)',
        }),
      ),
      transition('void => visivel', [
        style({ opacity: 0, transform: 'scale(0)' }),
        animate(`${1.5 * CONSTANTES.ANIMATION_DELAY_TIME / 1000}s 10ms cubic-bezier(.68,.48,.34,1)`),
      ]),
    ]),
  ],
})
export class MenuAtalhoComponent implements OnInit {

  public acesso = new Acesso();
  public estado: string = 'visivel';
  public arrayOfLinkAcessado = new Array<LinkAcessado>();
  public matrizReferencia: Array<LinkAcessado>;
  constructor(
    private acessoComumService: AcessoComumService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.acesso = this.acessoComumService.listarFavoritos();
    this.arrayOfLinkAcessado = this.acesso.arrayOfAcessos.sort(
      (a, b) =>
        a.quantidadeAcessoLink < b.quantidadeAcessoLink
          ? 1
          : a.quantidadeAcessoLink > b.quantidadeAcessoLink
            ? -1
            : 0,
    );
    this.matrizReferencia = this.arrayOfLinkAcessado;
  }

  public filtrarAtalho(event: Event): void {
    const valorFiltro = (<HTMLInputElement>event.target).value;
    let matrizRetorno = new Array<LinkAcessado>();
    matrizRetorno = this.arrayOfLinkAcessado.filter((elemento) => {
      return elemento['descricao'].toLowerCase().indexOf(valorFiltro.toLocaleLowerCase()) != -1;
    });
    if (valorFiltro.length > 0) {
      this.arrayOfLinkAcessado = matrizRetorno;
    } else {
      this.arrayOfLinkAcessado = this.matrizReferencia;
    }
  }

  public limparFiltro(event: KeyboardEvent): void {
    // tslint:disable: triple-equals
    if (event.key == 'Backspace' || event.key == 'Delete') {
      setTimeout(() => {
        this.arrayOfLinkAcessado = this.matrizReferencia;
        this.filtrarAtalho(event);
      }, 50);
    }
  }

  public acessar(link: string) {
    this.router.navigate([link]);
  }

  public adicionarLinkAcessado(link: any) {
    const linkAcessado = new LinkAcessado();
    linkAcessado.link = link['link'];
    linkAcessado.descricao = link['texto'];
    linkAcessado.fontAwesome = link['imagem'];
    linkAcessado.corFontAwesome = link['cor'];
    this.acessoComumService.adicionarLinkAcessado(linkAcessado);
  }

}
