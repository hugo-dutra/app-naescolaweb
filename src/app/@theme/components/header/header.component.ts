import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';
import { CONSTANTES } from '../../../shared/constantes.shared';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  public linkFotoUsuario = "";
  userPictureOnly: boolean = false;
  user: any;

  themes = [
    {
      value: 'default',
      name: 'Claro',
    },
    {
      value: 'dark',
      name: 'Escuro',
    },
    {
      value: 'cosmic',
      name: 'Exótico',
    },
    {
      value: 'corporate',
      name: 'Corporativo',
    },
  ];

  currentTheme = 'dark';

  userMenu = [{ title: 'Profile' }, { title: 'Log out' }];

  public dadosUsuarioLogado: Object;
  public fotoUsuario: string;
  public nomeUsuario: string;
  public emailUsuario: string;
  public idUsuario: number;
  public nomeEscola: string;

  constructor(private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userService: UserData,
    private layoutService: LayoutService,
    private router: Router,
    private breakpointService: NbMediaBreakpointsService) {
  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;

    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: any) => this.user = users.nick);

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);

    this.carregarDadosUsuario();
    this.carregarDadosEscola();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  logout(userMenu: Object): void {
    this.limparDadosLocalStorage();
  }

  public limparDadosLocalStorage(): void {
    localStorage.removeItem("perm");
    localStorage.removeItem("dados");
    localStorage.removeItem("escola");
    localStorage.removeItem("grupos");
    localStorage.removeItem("menus");
    localStorage.removeItem("dados_escola");
    localStorage.removeItem("esc_id");
    localStorage.removeItem("token");
    setTimeout(() => {
      this.router.navigate(['/']);
      window.location.reload();
    }, 1000);
  }

  public carregarDadosUsuario(): void {
    this.dadosUsuarioLogado = Object.values(JSON.parse(Utils.decriptAtoB(localStorage.getItem("dados"), CONSTANTES.PASSO_CRIPT)))[0];
    this.fotoUsuario = this.dadosUsuarioLogado["foto"]
    this.nomeUsuario = this.dadosUsuarioLogado["nome"]
    this.emailUsuario = this.dadosUsuarioLogado["email"]
    this.idUsuario = this.dadosUsuarioLogado["id"];
  }

  public carregarDadosEscola(): void {
    this.nomeEscola = Utils.pegarDadosEscola()["nome_abreviado"];
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
}
