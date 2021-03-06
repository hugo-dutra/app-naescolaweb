import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';
import { DOCUMENT } from '@angular/common';
import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AcessoComumService } from '../../../shared/acesso-comum/acesso-comum.service';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
  animations: [
    trigger('chamado', [
      state(
        'visivel',
        style({
          opacity: 1,
        }),
      ),
      transition('void => visivel', [
        style({ opacity: 0 }),
        animate(CONSTANTES.ANIMATION_DELAY_TIME + 'ms ease-in-out'),
      ]),
    ]),
  ],
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  public linkFotoUsuario = '';
  public toggled: boolean = false;
  public estado: string = 'visivel';
  userPictureOnly: boolean = false;
  user: any;

  themes = [
    {
      value: 'default',
      name: 'Branco',
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
  public esc_id: string;
  public usr_id: string;
  public dashboardMaximizedStatus: boolean = false;
  public expandedIcon = 'expand-outline';
  public collapseIcon = 'collapse-outline';
  public alertIcon = 'alert-triangle';
  public tourIcon = 'question-mark-circle';
  public element;
  public exibirBotaoAlertaOcorrencia: boolean = false;
  public alertasTratados: number = 0;
  public exibirIconeAjuda: boolean = false;

  constructor(private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userService: UserData,
    private layoutService: LayoutService,
    private router: Router,
    private breakpointService: NbMediaBreakpointsService,
    private acessoComumService: AcessoComumService,

    @Inject(DOCUMENT) private document: any,
  ) {
  }

  ngOnInit() {


    this.acessoComumService.emitirAlertaOcorrenciaDisciplinar.subscribe((alertas: Object[]) => {
      this.alertasTratados = alertas.length;
      if (this.alertasTratados > 0) {
        this.exibirBotaoAlertaOcorrencia = true;
      } else {
        this.exibirBotaoAlertaOcorrencia = false;
      }
    });
    this.element = document.documentElement;

    try {
      const dados_usuario = JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados'), CONSTANTES.PASSO_CRIPT))[0];
      this.esc_id = Utils.pegarDadosEscola()['id'];
      this.usr_id = (dados_usuario['id']);

      if (localStorage.getItem(`default_theme_${this.esc_id}_${this.usr_id}`) == 'default'
        || localStorage.getItem(`default_theme_${this.esc_id}_${this.usr_id}`) == 'dark'
        || localStorage.getItem(`default_theme_${this.esc_id}_${this.usr_id}`) == 'cosmic'
        || localStorage.getItem(`default_theme_${this.esc_id}_${this.usr_id}`) == 'corporate') {
        this.themeService.changeTheme(localStorage.getItem(`default_theme_${this.esc_id}_${this.usr_id}`));
      } else {
        this.themeService.changeTheme('default');
      }
    } catch (erro) {
      // console.log('Erro ao carregar Thema.');
      this.themeService.changeTheme('default');
    }

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

  public gerenciarPerfil(): void {
    this.router.navigate(['listar-usuario/gerenciar-usuario']);
  }


  public visualizarAlertasOcorrencia(): void {
    this.router.navigate(['gerenciar-alerta-ocorrencia/receber-alerta-ocorrencia']);
  }

  public iniciarTour(): void {
    this.acessoComumService.emitirAlertaInicioTour.emit();
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    localStorage.setItem(`default_theme_${this.esc_id}_${this.usr_id}`, themeName);
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.toggled = !this.toggled;
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();
    return false;
  }

  public logout(userMenu: Object): void {
    this.limparDadosLocalStorage();
  }

  public limparDadosLocalStorage(): void {
    this.router.navigate(['logar']);
    this.acessoComumService.emitirAlertaLogout.emit(true);

    /* localStorage.removeItem("perm");
    localStorage.removeItem("dados");
    localStorage.removeItem("escola");
    localStorage.removeItem("grupos");
    localStorage.removeItem("menus");
    localStorage.removeItem("dados_escola");
    localStorage.removeItem("esc_id");
    localStorage.removeItem("token");
    this.router.navigate(['']);
    window.location.reload(); */
  }

  public carregarDadosUsuario(): void {
    this.dadosUsuarioLogado = Object.values(JSON.parse(Utils.decriptAtoB(localStorage.getItem('dados'),
      CONSTANTES.PASSO_CRIPT)))[0];
    this.fotoUsuario = this.dadosUsuarioLogado['foto'];
    this.nomeUsuario = this.dadosUsuarioLogado['nome'];
    this.emailUsuario = this.dadosUsuarioLogado['email'];
    this.idUsuario = this.dadosUsuarioLogado['id'];
  }

  public alterarTamanhoDashboard(event: Event): void {
    this.dashboardMaximizedStatus = !this.dashboardMaximizedStatus;
    (<HTMLInputElement>event.target).requestFullscreen();

    if (this.dashboardMaximizedStatus) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen();
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }

  // alert(this.dashboardMaximizedStatus);
  public carregarDadosEscola(): void {
    this.nomeEscola = Utils.pegarDadosEscola()['nome_abreviado'];
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
}
