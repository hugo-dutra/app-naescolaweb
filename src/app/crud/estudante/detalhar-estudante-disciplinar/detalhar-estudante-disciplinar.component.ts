import { Component, OnInit } from '@angular/core';
import { OcorrenciaService } from '../../ocorrencia/ocorrencia.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Estudante } from '../estudante.model';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-detalhar-estudante-disciplinar',
  templateUrl: './detalhar-estudante-disciplinar.component.html',
  styleUrls: ['./detalhar-estudante-disciplinar.component.scss'],
  providers: [OcorrenciaService],
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
export class DetalharEstudanteDisciplinarComponent implements OnInit {

  public estudante = new Estudante();
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private ocorrenciaService: OcorrenciaService) { }

  public ocorrencias: Array<Object>;
  public nomeEstudanteOcorrenciaProcurado: string;
  public esc_id: number;
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public totalRegistros: number;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;

  ngOnInit() {
    this.esc_id = parseInt(Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT));
    this.route.queryParams.subscribe((estudante: Estudante) => {
      this.estudante = JSON.parse(estudante["estudante"]);
    });
    this.nomeEstudanteOcorrenciaProcurado = this.estudante.nome;
    this.filtrarOcorrencia();
  }

  //#region ######################################### CONSULTAR OCORRENCIAS #################################################
  public gravarNomeOcorrencia(event: Event): void {
    this.nomeEstudanteOcorrenciaProcurado = (<HTMLInputElement>(
      event.target
    )).value;
  }

  public pesquisarOcorrencia(): void {
    this.filtrarOcorrencia();
  }

  public filtrarOcorrenciaEnter(event: KeyboardEvent) {
    if (event.key == "Enter") {
      this.filtrarOcorrencia();
    }
  }

  public detalharEstudante(): void {
    let navigationExtras: NavigationExtras = {
      queryParams: { estudante: JSON.stringify(this.estudante) }
    };
    this.router.navigate([`${this.route.parent.routeConfig.path}/detalhar-estudante`], navigationExtras);
  }

  public filtrarOcorrencia(limit: number = 5, offset: number = 0): void {
    this.feedbackUsuario = "Procurando ocorrências, aguarde...";
    this.ocorrenciaService
      .filtrar(this.nomeEstudanteOcorrenciaProcurado, 5000, offset, this.esc_id)
      .toPromise()
      .then((response: Response) => {
        this.ocorrencias = Object.values(response);
        this.feedbackUsuario = undefined;
      })
      .catch((erro: Response) => {
        this.feedbackUsuario = undefined;
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
    //Gravar erros no analytics
    Utils.gravarErroAnalytics(JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
      });
  }

}
