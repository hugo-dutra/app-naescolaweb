import { Component, OnInit, Injectable } from "@angular/core";
import { SerieService } from "../serie.service";
import { EtapaEnsinoService } from "../../etapa-ensino/etapa-ensino.service";
import { Serie } from "../serie.model";
import { CONSTANTES } from "../../../shared/constantes.shared";
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";
import { Router } from "@angular/router";
import { FormGroup, FormControl } from "@angular/forms";
import { Utils } from "../../../shared/utils.shared";
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';

@Component({
  selector: "app-inserir-serie",
  templateUrl: "./inserir-serie.component.html",
  styleUrls: ["./inserir-serie.component.scss"],
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
@Injectable()
export class InserirSerieComponent implements OnInit {
  public etapasEnsino: Object;
  public serie = new Serie();
  public estado: string = "visivel";
  public feedbackUsuario: string;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;

  public formulario = new FormGroup({
    id: new FormControl(null),
    nome: new FormControl(null),
    abreviatura: new FormControl(null),
    ete_id: new FormControl(null),
    ete_nome: new FormControl(null),
    ete_abreviatura: new FormControl(null)
  });

  constructor(
    private serieService: SerieService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router,
    private etapaEnsinoService: EtapaEnsinoService
  ) { }

  ngOnInit() {
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

  public validar(event: Event) {
    Utils.validarCampos({ event: event });
    this.exibirAlerta = false;
  }

  public inserir(): void {
    this.serie.nome = this.formulario.value.nome;
    this.serie.abreviatura = this.formulario.value.abreviatura;
    this.serie.ete_id = this.formulario.value.ete_id;
    this.feedbackUsuario = "Salvando dados, aguarde...";

    this.serieService
      .inserir(this.serie)
      .toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = undefined;
        this.formulario.reset();
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

  public listar(): void {
    this.router.navigate(["listar-serie"]);
  }
}
