import { Component, OnInit, Injectable } from "@angular/core";
import { TurmaService } from "../turma.service";
import { TurnoService } from "../../turno/turno.service";
import { SerieService } from "../../serie/serie.service";
import { Turma } from "../turma.model";
import { Router } from "@angular/router";
import { FormGroup, FormControl } from "@angular/forms";
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";
import { CONSTANTES } from "../../../shared/constantes.shared";
import { EscolaService } from "../../escola/escola.service";
import { Utils } from "../../../shared/utils.shared";
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';


@Component({
  selector: "app-inserir-turma",
  templateUrl: "./inserir-turma.component.html",
  styleUrls: ["./inserir-turma.component.scss"],
  providers: [TurmaService, TurnoService, SerieService, EscolaService],
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
export class InserirTurmaComponent implements OnInit {
  public arrayTurmasSelecionadas = new Array<Turma>();
  public turnos: Object;
  public series: Object;
  public turma = new Turma();
  public estado: string = "visivel";
  public feedbackUsuario: string;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;
  public turmasPadrao: Turma[] = CONSTANTES.TURMAS_PADRAO;

  public formulario = new FormGroup({
    turma_personalizada: new FormControl(null),
    turma_especifica: new FormControl(null),
    sre_id: new FormControl(null),
    trn_id: new FormControl(null),
    check_turma: new FormControl(null)
  });

  constructor(
    private turmaService: TurmaService,
    private turnoService: TurnoService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private serieService: SerieService,
    private router: Router
  ) { }

  ngOnInit() {
    this.listarSeries();
    this.listarTurnos();
  }

  public gravaTurmasAdicionadas(event: Event, turma: Turma): void {
    let status: boolean = (<HTMLInputElement>event.target).checked;
    turma.sre_id = this.formulario.value.sre_id;
    turma.trn_id = this.formulario.value.trn_id;
    turma.esc_id = parseInt(Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT));
    turma.ano = new Date().getFullYear();
    let adicionar: boolean = false;

    if (turma.sre_id != null && turma.trn_id != null && turma.esc_id != null) {
      adicionar = true;
    }

    this.exibirAlerta = !adicionar;

    if (this.exibirAlerta) {
      this.formulario.reset();
    }

    if (adicionar) {
      if (status) {
        this.arrayTurmasSelecionadas.push(turma);
      } else {
        this.arrayTurmasSelecionadas.splice(
          this.arrayTurmasSelecionadas.indexOf(turma, 0),
          1
        );
      }
    }
  }

  public adicionarTurmaPersonalizada(): void {
    let turma = new Turma();
    let adicionar: boolean = false;
    turma.nome = this.formulario.value.turma_personalizada.toUpperCase();
    turma.sre_id = this.formulario.value.sre_id;
    turma.trn_id = this.formulario.value.trn_id;
    turma.esc_id = parseInt(Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT));
    turma.ano = new Date().getFullYear();

    if (turma.sre_id != null && turma.trn_id != null && turma.esc_id != null) {
      adicionar = true;
    }
    this.exibirAlerta = !adicionar;

    if (this.exibirAlerta) {
      this.formulario.reset();
    }

    if (adicionar) {
      this.arrayTurmasSelecionadas.push(turma);
    }
  }

  public removerTurmaSelecionada(turma: Turma): void {
    this.arrayTurmasSelecionadas.splice(
      this.arrayTurmasSelecionadas.indexOf(turma, 0),
      1
    );
  }

  public inserir(): void {
    this.feedbackUsuario = "Salvando dados, aguarde...";
    this.turmaService
      .inserir(this.arrayTurmasSelecionadas)
      .toPromise()
      .then((response: Response) => {
        this.formulario.reset();
        this.feedbackUsuario = undefined;
        this.arrayTurmasSelecionadas = [];
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
        this.arrayTurmasSelecionadas = [];
      });
  }

  public listarTurnos(): void {
    this.feedbackUsuario = "Carregando dados, aguarde...";
    let esc_id = parseInt(Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT));
    this.turnoService
      .listar(esc_id)
      .toPromise()
      .then((response: Response) => {
        this.turnos = response;
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

  public listarSeries(): void {
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
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
        //Gravar erros no analytics
        Utils.gravarErroAnalytics(JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      });
  }

  public listar(): void {
    this.router.navigateByUrl("listar-turma");
  }
}
