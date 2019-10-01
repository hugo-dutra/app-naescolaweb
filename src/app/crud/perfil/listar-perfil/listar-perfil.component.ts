import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../perfil.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Perfil } from '../perfil.model';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-listar-perfil',
  templateUrl: './listar-perfil.component.html',
  styleUrls: ['./listar-perfil.component.scss'],
  providers: [PerfilService],
  animations: [
    trigger("chamado", [
      state(
        "visivel",
        style({
          opacity: 1
        })
      ),
      transition("void => visivel", [
        style({ opacity: 0 }),
        animate(CONSTANTES.ANIMATION_DELAY_TIME + "ms ease-in-out")
      ])
    ])
  ]
})

export class ListarPerfilComponent implements OnInit {

  public perfis = new Array<Object>();
  public perfil = new Perfil();
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;
  public exibirComponenteAlterar: Boolean = false;
  public exibirComponenteInserir: Boolean = false;
  public exibirComponenteExcluir: Boolean = false;
  public decrescente: boolean = true;

  constructor(
    private perfilService: PerfilService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router,
    private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.perfis = undefined;
    this.exibirComponentesEdicao();
    this.listar();
  }

  public listar(): void {
    this.feedbackUsuario = "Carregando dados, aguarde...";
    this.perfilService
      .listar()
      .toPromise()
      .then((response: Response) => {
        this.perfis = Object.values(response);
        this.feedbackUsuario = undefined;
      })
      .catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      });
  }

  public ordenarColuna(campo: string): void {
    if (!this.decrescente) {
      let retorno = this.perfis.sort(function (a, b) {
        if (a[campo] < b[campo]) {
          return 1;
        }
        if (a[campo] > b[campo]) {
          return -1;
        }
        return 0;
      })
      this.perfis = retorno;

    } else {
      let retorno = this.perfis.sort(function (a, b) {
        if (a[campo] > b[campo]) {
          return 1;
        }
        if (a[campo] < b[campo]) {
          return -1;
        }
        return 0;
      })
      this.perfis = retorno;
    }
    this.decrescente = !this.decrescente;
  }
  public inserir(): void {
    this.router.navigate([`${this.router.url}/inserir-perfil`]);
  }

  public alterar(perfil: Perfil): void {
    let navigationExtras: NavigationExtras = {
      queryParams: { perfil: JSON.stringify(perfil) }
    };
    this.router.navigate([`${this.router.url}/alterar-perfil`], navigationExtras);
  }

  public excluir(perfil: Perfil): void {
    let navigationExtras: NavigationExtras = {
      queryParams: { perfil: JSON.stringify(perfil) }
    };
    this.router.navigate([`${this.router.url}/excluir-perfil`], navigationExtras);
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
  }


}
