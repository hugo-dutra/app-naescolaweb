import { Component, OnInit } from '@angular/core';
import { RegiaoEscolaService } from '../regiao-escola.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { RegiaoEscola } from '../regiao-escola.model';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-listar-regiao-escola',
  templateUrl: './listar-regiao-escola.component.html',
  styleUrls: ['./listar-regiao-escola.component.scss'],
  providers: [RegiaoEscolaService],
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
export class ListarRegiaoEscolaComponent implements OnInit {

  public regiaoEscola = new RegiaoEscola();
  public regioesEscolas = new Array<Object>();
  public estado: string = "visivel";
  public feedbackUsuario: string;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirComponenteAlterar: Boolean = false;
  public exibirComponenteInserir: Boolean = false;
  public exibirComponenteExcluir: Boolean = false;
  public decrescente: boolean = true;

  constructor(
    private regiaoEscolaService: RegiaoEscolaService,
    private route: ActivatedRoute,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router
  ) { }

  ngOnInit() {
    this.exibirComponentesEdicao();
    this.listar();

  }
  public exibirComponentesEdicao(): void {
    this.exibirComponenteAlterar = Utils.exibirComponente('alterar-regiao-escola');
    this.exibirComponenteExcluir = Utils.exibirComponente('excluir-regiao-escola');
    this.exibirComponenteInserir = Utils.exibirComponente('inserir-regiao-escola');
  }

  public ordenarColuna(campo: string): void {
    if (!this.decrescente) {
      let retorno = this.regioesEscolas.sort(function (a, b) {
        if (a[campo] < b[campo]) {
          return 1;
        }
        if (a[campo] > b[campo]) {
          return -1;
        }
        return 0;
      })
      this.regioesEscolas = retorno;

    } else {
      let retorno = this.regioesEscolas.sort(function (a, b) {
        if (a[campo] > b[campo]) {
          return 1;
        }
        if (a[campo] < b[campo]) {
          return -1;
        }
        return 0;
      })
      this.regioesEscolas = retorno;
    }
    this.decrescente = !this.decrescente;
  }

  public listar() {
    this.feedbackUsuario = "Carregando dados, aguarde...";
    this.regiaoEscolaService
      .listar()
      .toPromise()
      .then((response: Response) => {
        this.regioesEscolas = Object.values(response);
        this.feedbackUsuario = undefined;
      })
      .catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
    //Gravar erros no analytics
    Utils.gravarErroAnalytics(JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      });
  }

  public adicionar() {
    this.router.navigate([`${this.route.parent.routeConfig.path}/inserir-regiao-escola`]);
  }

  public alterar(regiaoEscola: RegiaoEscola) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        regiaoEscola: JSON.stringify(regiaoEscola)
      }
    };
    this.router.navigate([`${this.route.parent.routeConfig.path}/alterar-regiao-escola`], navigationExtras);
  }

  public excluir(regiaoEscola: RegiaoEscola) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        regiaoEscola: JSON.stringify(regiaoEscola)
      }
    };
    this.router.navigate([`${this.route.parent.routeConfig.path}/excluir-regiao-escola`], navigationExtras);
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

}
