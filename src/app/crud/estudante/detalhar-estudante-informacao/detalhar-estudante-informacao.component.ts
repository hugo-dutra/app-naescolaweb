import { Component, OnInit } from '@angular/core';
import { EstudanteService } from '../estudante.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Estudante } from '../estudante.model';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-detalhar-estudante-informacao',
  templateUrl: './detalhar-estudante-informacao.component.html',
  styleUrls: ['./detalhar-estudante-informacao.component.scss'],
  providers: [EstudanteService],
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
export class DetalharEstudanteInformacaoComponent implements OnInit {

  public estudante = new Estudante();
  public estado: string = "visivel";
  public feedbackUsuario: string;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public telefonesEstudante = new Array<Object>();
  public dadosTurma = new Object();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private estudanteService: EstudanteService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.route.queryParams.subscribe((estudante: Estudante) => {
      this.estudante = JSON.parse(estudante["estudante"]);
    });
    this.listarTelefonesContato();
  }

  public detalharEstudante(): void {
    let navigationExtras: NavigationExtras = {
      queryParams: { estudante: JSON.stringify(this.estudante) }
    };
    this.router.navigate([`${this.route.parent.routeConfig.path}/detalhar-estudante`], navigationExtras);
  }

  public listarTelefonesContato(): void {
    this.feedbackUsuario = "Carregando telefones de contato..."
    this.estudanteService.listarTelefones(this.estudante.id).toPromise().then((response: Response) => {
      this.telefonesEstudante = Object.values(response);
      this.listarDadosTurmaEstudante();
    }).catch((erro: Response) => {
      //Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      //registra log de erro no firebase usando serviço singlenton
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
      //Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
      this.feedbackUsuario = undefined;
    })
  }

  public listarDadosTurmaEstudante(): void {
    this.feedbackUsuario = "Carregando dados escolares..."
    this.estudanteService.listarDadosTurma(this.estudante.id).toPromise().then((response: Response) => {
      this.feedbackUsuario = undefined;
      if (Object.values(response).length > 0) {
        this.dadosTurma = Object.values(response)[0];
      }
    }).catch((erro: Response) => {
      //Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      //registra log de erro no firebase usando serviço singlenton
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
      //Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
      this.feedbackUsuario = undefined;
    })
  }
}
