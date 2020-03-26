import { NbMenuItem } from '@nebular/theme';
import { Utils } from '../shared/utils.shared';
import { LinkAcessado } from '../shared/acesso-comum/link-acessado.model';
import { AcessoComumService } from '../shared/acesso-comum/acesso-comum.service';

let localStorageGrupos: Array<Object>;
let localStorageMenus: Array<Object>;
const gruposCadastro = new Array<NbMenuItem>();
const gruposRelatorio = new Array<NbMenuItem>();

const acessoComumService = new AcessoComumService();

const adicionarLinkAcessado = (link: any) => {
  const linkAcessado = new LinkAcessado();
  linkAcessado.link = link['link'];
  linkAcessado.descricao = link['texto'];
  linkAcessado.fontAwesome = link['imagem'];
  linkAcessado.corFontAwesome = link['cor'];
  acessoComumService.adicionarLinkAcessado(linkAcessado);
};

const verificarPermissaoAcesso = (link: any): boolean => {
  const permissoes: Object = Utils.verificarPermissoes();
  const rota: string = link['link'].toString().split(',')[0];
  for (const key in permissoes) {
    if (permissoes[key]['rota'] == rota) {
      return true;
    }
  }
  return false;
};

try {
  localStorageGrupos = Object.values(Utils.verificarGrupos());
  localStorageMenus = Object.values(Utils.verificarMenus());
  for (let idxMenu = 0; idxMenu < localStorageMenus.length; idxMenu++) {
    if (verificarPermissaoAcesso(localStorageMenus[idxMenu])) {
      adicionarLinkAcessado(localStorageMenus[idxMenu]);
    }
  }

  for (let idxGrupo = 0; idxGrupo < localStorageGrupos.length; idxGrupo++) {
    if (localStorageGrupos[idxGrupo]['modulo'] == 'cadastro') {
      const menuItem = new NbMenuItem();
      menuItem.title = localStorageGrupos[idxGrupo]['texto'];
      menuItem.icon = 'layout-outline';
      const menus = new Array<NbMenuItem>();
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
      const menuItem = new NbMenuItem();
      menuItem.title = localStorageGrupos[idxGrupo]['texto'];
      menuItem.icon = 'layout-outline';

      const menus = new Array<NbMenuItem>();
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
  // tslint:disable-next-line: no-console
  console.log('Falha ao carregar dados de perfil!');
}

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Menu Inicial',
    icon: 'home',
    link: '/dashboard',
  },
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
    title: 'Atendimento',
    icon: 'bell',
    link: '/listar-usuario/enviar-sugestao-usuario',
  },
];







