import { Component, OnInit } from '@angular/core';
import { SerieService } from '../serie.service';
import { EtapaEnsinoService } from '../../etapa-ensino/etapa-ensino.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Serie } from '../serie.model';
import { EtapaEnsino } from '../../etapa-ensino/etapa-ensino.model';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-alterar-serie',
  templateUrl: './alterar-serie.component.html',
  styleUrls: ['./alterar-serie.component.scss'],
  providers: [SerieService, EtapaEnsinoService],
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
export class AlterarSerieComponent implements OnInit {

  public serie = new Serie();
  public etapaEnsino = new EtapaEnsino();
  public etapasEnsino: Object;
  public feedbackUsuario: string;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;
  public estado: string = "visivel";

  public formulario = new FormGroup({
    id: new FormControl(null),
    nome: new FormControl(null),
    ete_nome: new FormControl(null),
    ete_id: new FormControl(null)
  });

  constructor(
    private serieService: SerieService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router,
    private route: ActivatedRoute,
    private etapaEnsinoService: EtapaEnsinoService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((serie: Serie) => {
      this.serie = JSON.parse(serie["serie"]);
    });
    this.listarEtapaEnsino();
  }

  public listarEtapaEnsino(): void {
    this.feedbackUsuario = "Carregando dados, aguarde...";
    this.etapaEnsinoService
      .listar()
      .toPromise()
      .then((response: Response) => {
        this.etapasEnsino = response;
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

  public alterar(): void {
    this.feedbackUsuario = "Salvando dados, aguarde...";
    this.serieService
      .alterar(this.serie)
      .toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = undefined;
        this.formulario.reset();
        this.router.navigateByUrl("listar-serie");
      })
      .catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
        this.exibirAlerta = true;
      });
  }

  public modificarInputs(event: Event) {
    let campo: string = (<HTMLInputElement>event.target).name;
    let valor: string = (<HTMLInputElement>event.target).value;
    this.serie[campo] = valor;
    this.validar(event);
  }

  public validar(event: Event) {
    Utils.validarCampos({ event: event });
    this.exibirAlerta = false;
  }

  public listar(): void {
    this.router.navigateByUrl("listar-serie");
  }

}
