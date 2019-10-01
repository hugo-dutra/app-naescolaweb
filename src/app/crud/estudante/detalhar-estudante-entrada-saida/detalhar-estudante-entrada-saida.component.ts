import { Component, OnInit } from '@angular/core';
import { PortariaService } from '../../portaria/portaria.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Estudante } from '../estudante.model';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-detalhar-estudante-entrada-saida',
  templateUrl: './detalhar-estudante-entrada-saida.component.html',
  styleUrls: ['./detalhar-estudante-entrada-saida.component.scss'],
  providers: [PortariaService],
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
export class DetalharEstudanteEntradaSaidaComponent implements OnInit {

  public estudante = new Estudante();
  public estado: string = "visivel";
  public feedbackUsuario: string;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public historicoEntradasSaidas = new Array<Object>();
  public decrescente: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private portariaService: PortariaService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.route.queryParams.subscribe((estudante: Estudante) => {
      this.estudante = JSON.parse(estudante["estudante"]);
    });
    this.listarHistoricoEntradaSaida();
  }

  public ordenarColuna(campo: string): void {
    if (!this.decrescente) {
      let retorno = this.historicoEntradasSaidas.sort(function (a, b) {
        if (a[campo] < b[campo]) {
          return 1;
        }
        if (a[campo] > b[campo]) {
          return -1;
        }
        return 0;
      })
      this.historicoEntradasSaidas = retorno;

    } else {
      let retorno = this.historicoEntradasSaidas.sort(function (a, b) {
        if (a[campo] > b[campo]) {
          return 1;
        }
        if (a[campo] < b[campo]) {
          return -1;
        }
        return 0;
      })
      this.historicoEntradasSaidas = retorno;
    }
    this.decrescente = !this.decrescente;
  }

  public detalharEstudante(): void {
    let navigationExtras: NavigationExtras = {
      queryParams: { estudante: JSON.stringify(this.estudante) }
    };
    this.router.navigate([`${this.route.parent.routeConfig.path}/detalhar-estudante`], navigationExtras);
  }

  public listarHistoricoEntradaSaida(): void {
    this.feedbackUsuario = "Carregando registros de entrada e saída, aguarde...";
    this.portariaService.listarHistoricoEntradaSaidaEstudante(this.estudante.id).toPromise().then((response: Response) => {
      this.feedbackUsuario = undefined;
      this.historicoEntradasSaidas = Object.values(response);
    }).catch((erro: Response) => {
      //Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      //registra log de erro no firebase usando serviço singlenton
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
    //Gravar erros no analytics
    Utils.gravarErroAnalytics(JSON.stringify(erro));
      //Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
      this.feedbackUsuario = undefined;
    })


  }

}
