import { TurnoService } from './../../turno/turno.service';
import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { PortariaService } from '../portaria.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Portaria } from '../portaria.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Utils } from '../../../shared/utils.shared';
import { PortariaFirebase } from '../portaria.firebase.model';
import { TurnoPortariaService } from '../../turno-portaria/turno-portaria.service';
import { TurnoPortaria } from '../../turno-portaria/turno-portaria.model';

@Component({
  selector: 'ngx-alterar-portaria',
  templateUrl: './alterar-portaria.component.html',
  styleUrls: ['./alterar-portaria.component.scss'],
  providers: [FirebaseService, PortariaService, TurnoService, TurnoPortariaService],
  animations: [
    trigger("chamado",
      [
        state(
          "visivel",
          style({ opacity: 1 })
        ),
        transition(
          "void => visivel",
          [
            style({ opacity: 0 }),
            animate(CONSTANTES.ANIMATION_DELAY_TIME + "ms ease-in-out")
          ]
        )
      ])
  ]
})
export class AlterarPortariaComponent implements OnInit {

  public portaria = new Portaria();
  public portariaFirebase = new PortariaFirebase();
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;
  public esc_id: number;
  public arrayDeTurnos: Object[];
  public turnosPortaria = new Array<Object>();
  public turnosEscola = new Array<Object>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private portariaService: PortariaService,
    private turnoPortariaService: TurnoPortariaService,
    private turnoService: TurnoService) { }

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
  });

  ngOnInit() {
    this.route.queryParams.subscribe((objeto) => {
      this.portaria = JSON.parse(objeto["portaria"]);
    })
    this.esc_id = Utils.pegarDadosEscola()["id"];
    this.feedbackUsuario = undefined;
    this.listarTurnosPortaria();
  }

  public listarTurnosPortaria(): void {
    this.feedbackUsuario = "Carregando informações de turnos, aguarde...";
    this.turnoService.listar(this.esc_id).toPromise().then((response: Response) => {
      this.turnosEscola = Object.values(response).map((turno) => {
        return {
          trn_id: turno['id'], turno: turno['nome'],
          inicio: turno['horaInicio'], fim: turno['horaFim'],
          por_id: this.portaria.por_id, nome: this.portaria.nome,
          tolerancia_inicio: 0,
          tolerancia_fim: 0
        }
      });
      this.feedbackUsuario = "Carregando turnos da portaria, aguarde...";
      this.turnoPortariaService.listar(this.portaria.por_id).toPromise().then((response: Response) => {
        this.turnosPortaria = Object.values(response);
        this.turnosEscola.map((turnoEscola) => {
          this.turnosPortaria.forEach((turnoPortaria) => {
            if (turnoPortaria['trn_id'] == turnoEscola['trn_id']) {
              return Object.assign(turnoEscola, {
                por_id: this.portaria.por_id,
                nome: this.portaria.nome,
                tolerancia_inicio: turnoPortaria['tolerancia_inicio'],
                tolerancia_fim: turnoPortaria['tolerancia_fim']
              })
            }
          })
        })
        this.turnosPortaria = this.turnosEscola;
        //this.atualizarInputTolerancia();
        this.feedbackUsuario = undefined;
      }).catch((erro: Response) => {
        this.tratarErro(erro);
      })
    }).catch((erro: Response) => {
      this.tratarErro(erro);
    })
  }

  /**
   *
   */
  /* public listarTurnos(): void {
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
  } */

  /**
   *
   * @param turnos
   */
  /* public carregarTurnosPortaria(turnos: Object[]) {
    this.turnosPortaria = [];
    this.arrayDeTurnos.forEach(turno => {
      this.turnosPortaria.push({
        fim: turno['horaFim'], inicio: turno['horaInicio'], nome: turno['nome'],
        tolerancia_fim: 0, tolerancia_inicio: 0, trn_id: turno['id']
      });
    })
  } */


  /**
   *
   * @param turno
   * @param valor
   * @param event
   */
  public alterarParametrosPortaria(turnoPortaria: Object, valor: string, event: Event): void {
    const trn_id: number = parseInt(turnoPortaria['trn_id']);
    if (valor == 'inicio') {
      let contaTurno = 0;
      const tolerancia_inicio = parseInt((<HTMLInputElement>event.target).value);
      this.turnosPortaria.forEach(turnoPort => {
        if (turnoPort['trn_id'] == trn_id) {
          this.turnosPortaria[contaTurno] = {
            fim: turnoPort['fim'],
            inicio: turnoPort['inicio'],
            nome: turnoPort['nome'],
            por_id: turnoPort['por_id'],
            tolerancia_fim: turnoPort['tolerancia_fim'],
            tolerancia_inicio: tolerancia_inicio,
            trn_id: turnoPort['trn_id'],
            tup_id: turnoPort['tup_id'],
            turno: turnoPort['turno'],
          }
        }
        contaTurno++;
      })
    }
    if (valor == 'fim') {
      let contaTurno = 0;
      const tolerancia_fim = parseInt((<HTMLInputElement>event.target).value);
      this.turnosPortaria.forEach(turnoPort => {
        if (turnoPort['trn_id'] == trn_id) {
          this.turnosPortaria[contaTurno] = {
            fim: turnoPort['fim'],
            inicio: turnoPort['inicio'],
            nome: turnoPort['nome'],
            por_id: turnoPort['por_id'],
            tolerancia_fim: tolerancia_fim,
            tolerancia_inicio: turnoPort['tolerancia_inicio'],
            trn_id: turnoPort['trn_id'],
            tup_id: turnoPort['tup_id'],
            turno: turnoPort['turno'],
          }
        }
        contaTurno++;
      })
    }
  }


  public alterar(): void {
    this.feedbackUsuario = "Salvando modificações, aguarde...";
    this.portariaFirebase.turnos = [];
    this.portariaService.alterar(this.portaria).toPromise().then(() => {
      this.turnoPortariaService.alterar(<TurnoPortaria[]>this.turnosPortaria).toPromise().then((response: Response) => {
        this.feedbackUsuario = undefined;
        this.portariaFirebase.codigo = this.portaria.codigo;
        this.portariaFirebase.esc_id = this.portaria.esc_id;
        this.portariaFirebase.nome = this.portaria.nome;
        this.portariaFirebase.por_id = this.portaria.por_id;
        let arrayTemporarioTurno = new Array<Object>();
        this.turnosPortaria.forEach((turno) => {
          arrayTemporarioTurno.push({ fim: turno['fim'], inicio: turno['inicio'], nome: turno['turno'], tolerancia_fim: turno['tolerancia_fim'], tolerancia_inicio: turno['tolerancia_inicio'], trn_id: turno['trn_id'] });
        })
        this.portariaFirebase.turnos = [...arrayTemporarioTurno];
        this.firebaseService.alterarConfiguracaoFirebaseFirestorePortaria(this.portariaFirebase);
        this.firebaseService.alterarConfiguracaoPortariaFirestoreApp(this.portaria.codigo.split('_')[0], this.portaria.codigo, this.portaria.nome);
        this.listar();
      }).catch((erro: Response) => {
        this.tratarErro(erro);
      })
    }).catch((erro: Response) => {
      this.tratarErro(erro);
    })
  }


  public modificarInputs(event: Event) {
    let campo: string = (<HTMLInputElement>event.target).name;
    let valor: string = (<HTMLInputElement>event.target).value;
    this.portaria[campo] = valor;
    this.validar(event);
  }

  public listar(): void {
    this.router.navigate([`${this.route.parent.routeConfig.path}/listar-portaria`]);
  }

  public validar(event: Event) {
    Utils.validarCampos({ event: event });
    this.exibirAlerta = false;
  }

  public tratarErro(erro: Response): void {
    //Mostra modal
    this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
    //registra log de erro no firebase usando serviço singlenton
    this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
    //Gravar erros no analytics
    Utils.gravarErroAnalytics(JSON.stringify(erro));
    //Caso token seja invalido, reenvia rota para login
    Utils.tratarErro({ router: this.router, response: erro });
    this.feedbackUsuario = undefined;
  }

}
