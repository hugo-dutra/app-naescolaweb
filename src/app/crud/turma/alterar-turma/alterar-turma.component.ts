import { Utils } from './../../../shared/utils.shared';
import { Component, OnInit } from '@angular/core';
import { TurmaService } from '../turma.service';
import { EscolaService } from '../../escola/escola.service';
import { SerieService } from '../../serie/serie.service';
import { TurnoService } from '../../turno/turno.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Turma } from '../turma.model';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'ngx-alterar-turma',
  templateUrl: './alterar-turma.component.html',
  styleUrls: ['./alterar-turma.component.scss'],
  providers: [TurmaService, EscolaService, SerieService, TurnoService],
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
export class AlterarTurmaComponent implements OnInit {

  public turma = new Turma();
  public escolas: Object;
  public series: Object;
  public turnos: Object;
  public turmas: Array<Turma>;// = CONSTANTES.TURMAS_PADRAO;

  public feedbackUsuario: string;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;
  public estado: string = "visivel";
  public anoAtual: number = 0;
  public esc_id: number = 0;
  constructor(
    private turmaService: TurmaService,
    private router: Router,
    private route: ActivatedRoute,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private escolaService: EscolaService,
    private serieService: SerieService,
    private turnoService: TurnoService
  ) { }

  public formulario = new FormGroup({
    id: new FormControl(null),
    trn_id: new FormControl(null),
    sre_id: new FormControl(null),
    esc_id: new FormControl(null)
  });

  ngOnInit() {
    this.anoAtual = (new Date()).getFullYear();
    this.esc_id = Utils.pegarDadosEscolaDetalhado().id;
    this.route.queryParams.subscribe((turma: Turma) => {
      this.turma = JSON.parse(turma["turma"]);
    });
    this.listarEscola();
    this.listarSerie();
    this.listarTurno();
    this.listarTurmas();
  }

  public listarTurmas(): void {
    this.feedbackUsuario = "Carregando dados, aguarde...";
    this.turmaService.listarTodasAno(this.anoAtual, this.esc_id).toPromise().then((response: Response) => {
      this.turmas = Object.values(response);
      this.feedbackUsuario = undefined;
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


  public alterar(): void {
    this.feedbackUsuario = "Alterando dados, aguarde...";
    this.turmaService
      .alterar(this.turma)
      .toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = undefined;
        this.router.navigateByUrl("listar-turma");
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

  public listarEscola(): void {
    this.feedbackUsuario = "Carregando dados, aguarde...";
    this.escolaService
      .listar(50000, 0, true)
      .toPromise()
      .then((response: Response) => {
        this.escolas = response;
      })
      .then(() => {
        this.listarSerie();
      })
      .then(() => {
        this.listarTurno();
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

  public listarSerie(): void {
    this.feedbackUsuario = "Carregando dados, aguarde...";
    this.serieService
      .listar()
      .toPromise()
      .then((response: Response) => {
        this.series = response;
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

  public listarTurno(): void {
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

  public modificarInputs(event: Event) {
    let campo: string = (<HTMLInputElement>event.target).name;
    let valor: string = (<HTMLInputElement>event.target).value;
    this.turma[campo] = valor;
    this.validar(event);
  }

  public validar(event: Event) {
    Utils.validarCampos({ event: event });
    this.exibirAlerta = false;
  }

}
