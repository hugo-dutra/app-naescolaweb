import { Component, OnInit } from '@angular/core';
import { SerieService } from '../serie.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Serie } from '../serie.model';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router, NavigationExtras } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-listar-serie',
  templateUrl: './listar-serie.component.html',
  styleUrls: ['./listar-serie.component.scss'],
  providers: [SerieService],
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
export class ListarSerieComponent implements OnInit {

  public series: Object;
  public serie = new Serie();
  public estado: string = "visivel";
  public feedbackUsuario: string;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirComponenteAlterar: Boolean = false;
  public exibirComponenteInserir: Boolean = false;
  public exibirComponenteExcluir: Boolean = false;

  constructor(
    private serieService: SerieService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router) { }

  ngOnInit() {
    this.exibirComponentesEdicao();
    this.listar();
  }

  public exibirComponentesEdicao(): void {
    this.exibirComponenteInserir = Utils.exibirComponente('inserir-serie');
    this.exibirComponenteAlterar = Utils.exibirComponente('alterar-serie');
    this.exibirComponenteExcluir = Utils.exibirComponente('excluir-serie');
  }

  public listar(): void {
    this.feedbackUsuario = "Carregando dados, aguarde...";
    this.serieService
      .listar()
      .toPromise()
      .then((response: Response) => {
        this.series = response;
        this.feedbackUsuario = undefined;
      })
      .catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      });
  }
  public alterar(serie: Serie): void {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        serie: JSON.stringify(serie)
      }
    };
    this.router.navigate([`${this.router.url}/alterar-serie`], navigationExtras);
  }

  public excluir(serie: Serie): void {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        serie: JSON.stringify(serie)
      }
    };
    this.router.navigate([`${this.router.url}/excluir-serie`], navigationExtras);
  }

  public adicionar(): void {
    this.router.navigate([`${this.router.url}/inserir-serie`]);
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

}
