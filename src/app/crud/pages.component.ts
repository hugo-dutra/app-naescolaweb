import { Component } from '@angular/core';
/* import { AcessoComumService } from '../shared/acesso-comum/acesso-comum.service'; */
import { MENU_ITEMS } from './pages-menu';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent {

  /* constructor(private acessoComumService: AcessoComumService) { } */

  /* public desativarIconeAjuda(): void {
    this.acessoComumService.emitirAlertaExibirIconeAjuda.emit(false);
  } */

  menu = MENU_ITEMS;
}
