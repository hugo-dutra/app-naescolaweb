import { Component, OnInit } from '@angular/core';
import { TurnoService } from '../turno.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Turno } from '../turno.model';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router, NavigationExtras } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-listar-turno',
  templateUrl: './listar-turno.component.html',
  styleUrls: ['./listar-turno.component.scss'],
  providers: [TurnoService],
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
export class ListarTurnoComponent implements OnInit {

  public turnos: Object;
  public turno = new Turno();
  public estado: string = "visivel";
  public feedbackUsuario: string;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;

  constructor(
    private turnoService: TurnoService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router) { }

  ngOnInit() {
    this.listar();
  }

  public listar(): void {
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
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      });
  }

  public adicionar(): void {
    this.router.navigate([`${this.router.url}/inserir-turno`]);
  }

  public alterar(turno: Turno) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: turno.id,
        nome: turno.nome,
        horaInicio: turno.horaInicio,
        horaFim: turno.horaFim,
        abreviatura: turno.abreviatura
      }
    };
    this.router.navigate([`${this.router.url}/alterar-turno`], navigationExtras)
  }

  public excluir(turno: Turno) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: turno.id,
        nome: turno.nome,
        horaInicio: turno.horaInicio,
        horaFim: turno.horaFim,
        abreviatura: turno.abreviatura
      }
    };
    this.router.navigate([`${this.router.url}/excluir-turno`], navigationExtras)
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

}