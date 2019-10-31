import { Component, OnInit } from '@angular/core';
import { PortariaService } from '../portaria.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Portaria } from '../portaria.model';
import { FormGroup, FormControl } from '@angular/forms';
import { Utils } from '../../../shared/utils.shared';
import { TurnoService } from '../../turno/turno.service';
import { TurnoPortaria } from '../../turno-portaria/turno-portaria.model';
import { TurnoPortariaService } from '../../turno-portaria/turno-portaria.service';
import { PortariaFirebase } from '../portaria.firebase.model';

@Component({
  selector: 'ngx-inserir-portaria',
  templateUrl: './inserir-portaria.component.html',
  styleUrls: ['./inserir-portaria.component.scss'],
  providers: [PortariaService, TurnoService, TurnoPortariaService],
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
export class InserirPortariaComponent implements OnInit {


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private portariaService: PortariaService,
    private turnoService: TurnoService,
    private turnoPortariaService: TurnoPortariaService) { }

  public portaria: Portaria = new Portaria();
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;
  public esc_id: number;
  public codigo_inep: string;
  public portariaFirebase = new PortariaFirebase();

  public arrayDeTurnos: Object[];
  public turnosPortaria = new Array<Object>();

  public formulario: FormGroup = new FormGroup({
    inicioMatutino: new FormControl(null),
    fimMatutino: new FormControl(null),
    toleranciaEntradaMatutino: new FormControl(null),
    toleranciaSaidaMatutino: new FormControl(null),
    inicioVespertino: new FormControl(null),
    fimVespertino: new FormControl(null),
    toleranciaEntradaVespertino: new FormControl(null),
    toleranciaSaidaVespertino: new FormControl(null),
    inicioNoturno: new FormControl(null),
    fimNoturno: new FormControl(null),
    toleranciaEntradaNoturno: new FormControl(null),
    toleranciaSaidaNoturno: new FormControl(null),
    nome: new FormControl(null),
    inicioIntegral: new FormControl(null),
    fimIntegral: new FormControl(null),
    toleranciaEntradaIntegral: new FormControl(null),
    toleranciaSaidaIntegral: new FormControl(null),
  })

  /**
   *
   */
  ngOnInit() {
    this.esc_id = Utils.pegarDadosEscola()["id"];
    this.codigo_inep = Utils.pegarDadosEscola()["inep"];

    this.feedbackUsuario = undefined;
    this.listarTurnos();
  }

  /**
   *
   */
  public listar(): void {
    this.router.navigate([`${this.route.parent.routeConfig.path}/listar-portaria`]);
  }

  /**
   *
   */
  public listarTurnos(): void {
    this.feedbackUsuario = "Carregando turnos, aguarde..."
    this.turnoService.listar(this.esc_id).toPromise().then((response: Response) => {
      this.arrayDeTurnos = Object.values(response);
      this.carregarTurnosPortaria(this.arrayDeTurnos);
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

  /**
  *
  * @param turnos
  */
  public carregarTurnosPortaria(turnos: Object[]) {
    this.turnosPortaria = [];
    this.arrayDeTurnos.forEach(turno => {
      this.turnosPortaria.push({
        fim: turno['horaFim'], inicio: turno['horaInicio'], nome: turno['nome'],
        tolerancia_fim: 0, tolerancia_inicio: 0, trn_id: turno['id']
      });
    })
  }

  /**
   *
   * @param turno
   * @param valor
   * @param event
   */
  public alterarParametrosPortaria(turno: Object, valor: string, event: Event): void {
    const trn_id: number = parseInt(turno['id']);
    if (valor == 'inicio') {
      let contaTurno = 0;
      const tolerancia_inicio = parseInt((<HTMLInputElement>event.target).value);
      this.turnosPortaria.forEach(turno => {
        if (turno['trn_id'] == trn_id) {
          this.turnosPortaria[contaTurno] = { fim: turno['fim'], inicio: turno['inicio'], nome: turno['nome'], tolerancia_fim: turno['tolerancia_fim'], tolerancia_inicio: tolerancia_inicio, trn_id: turno['trn_id'] }
        }
        contaTurno++;
      })
    }
    if (valor == 'fim') {
      let contaTurno = 0;
      const tolerancia_fim = parseInt((<HTMLInputElement>event.target).value);
      this.turnosPortaria.forEach(turno => {
        if (turno['trn_id'] == trn_id) {
          this.turnosPortaria[contaTurno] = { fim: turno['fim'], inicio: turno['inicio'], nome: turno['nome'], tolerancia_fim: tolerancia_fim, tolerancia_inicio: turno['tolerancia_inicio'], trn_id: turno['trn_id'] }
        }
        contaTurno++;
      })
    }
  }

  /**
   *
   */
  public inserir(): void {
    this.portaria.esc_id = this.esc_id;
    this.portaria.nome = this.formulario.value.nome;
    this.feedbackUsuario = "Salvando dados, aguarde...";
    this.portariaService.inserir(this.portaria).toPromise()
      .then((response: Response) => {
        const por_id: number = parseInt(response[0]['por_id']);
        this.inserirTurnosPortaria(por_id);
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

  public inserirTurnosPortaria(portaria_id: number): void {
    this.feedbackUsuario = "Inserindo turnos, aguarde...";
    let turnos_portaria = new Array<TurnoPortaria>()
    this.turnosPortaria.forEach(turnoPortaria => {
      const trnPort = new TurnoPortaria();
      trnPort.por_id = portaria_id;
      trnPort.tolerancia_fim = turnoPortaria['tolerancia_fim'];
      trnPort.tolerancia_inicio = turnoPortaria['tolerancia_inicio'];
      trnPort.trn_id = turnoPortaria['trn_id'];
      turnos_portaria.push(trnPort);
    })
    this.turnoPortariaService.inserir(turnos_portaria).toPromise().then(() => {
      this.inserirTurnosFirebase(portaria_id);
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

  /**
   *
   * @param portaria_id
   */
  public inserirTurnosFirebase(portaria_id: number): void {
    this.portariaFirebase.codigo = `${this.codigo_inep}_${portaria_id}`;
    this.portariaFirebase.esc_id = this.esc_id
    this.portariaFirebase.nome = this.portaria.nome;
    this.portariaFirebase.por_id = portaria_id;
    this.portariaFirebase.turnos = [...this.turnosPortaria];
    this.firebaseService.inserirConfiguracaoFirebaseFirestorePortaria(this.portariaFirebase);
    this.feedbackUsuario = undefined;
    this.listar();
  }

  /**
   *
   * @param event
   */
  public validar(event: Event) {
    Utils.validarCampos({ event: event });
    this.exibirAlerta = false;
  }


}
