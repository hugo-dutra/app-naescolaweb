import { Component, OnInit } from '@angular/core';
import { SaidaAntecipadaService } from '../../saida-antecipada/saida-antecipada.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Estudante } from '../estudante.model';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-detalhar-estudante-saida-antecipada',
  templateUrl: './detalhar-estudante-saida-antecipada.component.html',
  styleUrls: ['./detalhar-estudante-saida-antecipada.component.scss'],
  providers: [SaidaAntecipadaService],
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
export class DetalharEstudanteSaidaAntecipadaComponent implements OnInit {

  public estudante = new Estudante();
  public estado: string = "visivel";
  public feedbackUsuario: string;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public saidasAntecipadasEventuais = new Array<Object>();
  public saidasAntecipadasRecorrentes = new Array<Object>();
  public decrescente: boolean = false;

  constructor(
    private saidaAntecipadaService: SaidaAntecipadaService,
    private route: ActivatedRoute,
    private router: Router,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.route.queryParams.subscribe((estudante: Estudante) => {
      this.estudante = JSON.parse(estudante["estudante"]);
    });
    this.listarSaidaAntecipadaEventual();
  }

  public detalharEstudante(): void {
    let navigationExtras: NavigationExtras = {
      queryParams: { estudante: JSON.stringify(this.estudante) }
    };
    this.router.navigate([`${this.route.parent.routeConfig.path}/detalhar-estudante`], navigationExtras);
    this.listarSaidaAntecipadaEventual();
  }

  public listarSaidaAntecipadaEventual(): void {
    this.feedbackUsuario = "Carregando sa??das antecipadas eventuais, aguarde...";
    this.saidaAntecipadaService.listarEventualEstudante(this.estudante.id).toPromise().then((response: Response) => {
      this.feedbackUsuario = undefined;
      this.saidasAntecipadasEventuais = Object.values(response);
    }).catch((erro: Response) => {
      //Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      //registra log de erro no firebase usando servi??o singlenton
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
    //Gravar erros no analytics
    Utils.gravarErroAnalytics(JSON.stringify(erro));
      //Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
      this.feedbackUsuario = undefined;
    })
  }

  public ordenarColuna(campo: string): void {
    if (!this.decrescente) {
      let retorno = this.saidasAntecipadasEventuais.sort(function (a, b) {
        if (a[campo] < b[campo]) {
          return 1;
        }
        if (a[campo] > b[campo]) {
          return -1;
        }
        return 0;
      })
      this.saidasAntecipadasEventuais = retorno;

    } else {
      let retorno = this.saidasAntecipadasEventuais.sort(function (a, b) {
        if (a[campo] > b[campo]) {
          return 1;
        }
        if (a[campo] < b[campo]) {
          return -1;
        }
        return 0;
      })
      this.saidasAntecipadasEventuais = retorno;
    }
    this.decrescente = !this.decrescente;
  }



}
