import { NbMenuItem } from '@nebular/theme';
import { Utils } from '../shared/utils.shared';
import { Title } from '@angular/platform-browser';

let localStorageGrupos: Array<Object>;
let localStorageMenus: Array<Object>;
let gruposCadastro = new Array<NbMenuItem>();
let gruposRelatorio = new Array<NbMenuItem>();

try {
  localStorageGrupos = Object.values(Utils.verificarGrupos());
  localStorageMenus = Object.values(Utils.verificarMenus());

  for (let idxGrupo = 0; idxGrupo < localStorageGrupos.length; idxGrupo++) {

    if (localStorageGrupos[idxGrupo]['modulo'] == 'cadastro') {
      let menuItem = new NbMenuItem();
      menuItem.title = localStorageGrupos[idxGrupo]['texto'];
      menuItem.icon = 'layout-outline';
      let menus = new Array<NbMenuItem>();
      for (let idxMenu = 0; idxMenu < localStorageMenus.length; idxMenu++) {
        if (localStorageGrupos[idxGrupo]['nome'] == localStorageMenus[idxMenu]['grupo']) {
          const menu = new NbMenuItem;
          menu.title = localStorageMenus[idxMenu]['texto'];
          menu.link = `/${localStorageMenus[idxMenu]['link']}`;
          menus.push(menu);
        }
      }
      menuItem.children = menus;
      gruposCadastro.push(menuItem);
    }

    if (localStorageGrupos[idxGrupo]['modulo'] == 'relatorio') {
      let menuItem = new NbMenuItem();
      menuItem.title = localStorageGrupos[idxGrupo]['texto'];
      menuItem.icon = 'layout-outline';

      let menus = new Array<NbMenuItem>();
      for (let idxMenu = 0; idxMenu < localStorageMenus.length; idxMenu++) {
        if (localStorageGrupos[idxGrupo]['nome'] == localStorageMenus[idxMenu]['grupo']) {
          const menu = new NbMenuItem;
          menu.title = localStorageMenus[idxMenu]['texto'];
          menu.link = `/${localStorageMenus[idxMenu]['link']}`;
          menus.push(menu);
        }
      }
      menuItem.children = menus;
      gruposRelatorio.push(menuItem);
    }
  }
} catch (erro) {
  console.log('Falha ao carregar dados de perfil!');
}

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Cadastros',
    icon: 'edit-2-outline',
    children: [...gruposCadastro],
  },
  {
    title: 'Relatórios',
    icon: 'pie-chart',
    children: [...gruposRelatorio],
  },
  {
    title: 'Sugestões',
    icon: 'bell',
    link: ''
  }
];







