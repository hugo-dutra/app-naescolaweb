import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../perfil.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Perfil } from '../perfil.model';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';
import { PerfilPermissaoService } from '../../perfil-permissao/perfil-permissao.service';

@Component({
  selector: 'ngx-listar-perfil',
  templateUrl: './listar-perfil.component.html',
  styleUrls: ['./listar-perfil.component.scss'],
  providers: [PerfilService, PerfilPermissaoService],
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

export class ListarPerfilComponent implements OnInit {

  public perfis = new Array<Object>();
  public escoposPerfil = new Array<Object>();
  public perfil = new Perfil();
  public permissoesPerfil = new Array<Object>();
  public feedbackUsuario: string;
  public estado: string = 'visivel';
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;
  public exibirComponenteAlterar: Boolean = false;
  public exibirComponenteInserir: Boolean = false;
  public exibirComponenteExcluir: Boolean = false;
  public exibirComponenteDetalhar: Boolean = false;
  public decrescente: boolean = true;
  public esc_id: number;

  constructor(
    private perfilService: PerfilService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private perfilPermissaoService: PerfilPermissaoService,
    private router: Router) { }

  ngOnInit() {
    this.perfis = undefined;
    this.esc_id = Utils.pegarDadosEscolaDetalhado().id;
    this.exibirComponentesEdicao();
    this.listar();
  }

  public listar(): void {

    this.feedbackUsuario = 'Carregando dados, aguarde...';
    const nivelPerfil = Utils.pegarDadosEscopo().nivel;
    this.perfilService
      .listar(nivelPerfil, this.esc_id)
      .toPromise()
      .then((response: Response) => {
        this.perfis = Object.values(response);
        this.feedbackUsuario = undefined;
      })
      .catch((erro: Response) => {
        // Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        // registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`,
          JSON.stringify(erro));
        // Gravar erros no analytics
        Utils.gravarErroAnalytics(JSON.stringify(erro));
        // Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      });

  }

  public ordenarColuna(campo: string): void {
    if (!this.decrescente) {
      const retorno = this.perfis.sort(function (a, b) {
        if (a[campo] < b[campo]) {
          return 1;
        }
        if (a[campo] > b[campo]) {
          return -1;
        }
        return 0;
      });
      this.perfis = retorno;

    } else {
      const retorno = this.perfis.sort(function (a, b) {
        if (a[campo] > b[campo]) {
          return 1;
        }
        if (a[campo] < b[campo]) {
          return -1;
        }
        return 0;
      });
      this.perfis = retorno;
    }
    this.decrescente = !this.decrescente;
  }

  public inserir(): void {
    this.router.navigate([`${this.router.url}/inserir-perfil`]);
  }

  public alterar(perfil: Perfil): void {
    const navigationExtras: NavigationExtras = {
      queryParams: { perfil: JSON.stringify(perfil) },
    };
    this.router.navigate([`${this.router.url}/alterar-perfil`], navigationExtras);
  }

  public excluir(perfil: Perfil): void {
    const navigationExtras: NavigationExtras = {
      queryParams: { perfil: JSON.stringify(perfil) },
    };
    this.router.navigate([`${this.router.url}/excluir-perfil`], navigationExtras);
  }

  public detalharPerfil(perfil: Perfil): void {
    this.permissoesPerfil = [];
    this.feedbackUsuario = 'Carregando detalhes, aguarde...';
    this.perfilPermissaoService.listarPermissaoAcesso(perfil.id).toPromise().then((response: Response) => {
      const listadePerfils = Object.values(response);
      this.permissoesPerfil = listadePerfils.sort((a, b) => {
        if (a['nome'] > b['nome']) {
          return 1;
        } else {
          return -1;
        }
      });
      this.feedbackUsuario = undefined;
    });

  }



  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

  public inserirPerfilPermissao(): void {
    this.router.navigate(['inserir-perfil-permissao']);
  }

  public exibirComponentesEdicao(): void {
    this.exibirComponenteAlterar = Utils.exibirComponente('alterar-perfil');
    this.exibirComponenteExcluir = Utils.exibirComponente('excluir-perfil');
    this.exibirComponenteInserir = Utils.exibirComponente('inserir-perfil');
    this.exibirComponenteDetalhar = Utils.exibirComponente('detalhar-perfil');
  }


}
