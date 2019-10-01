import { Component, OnInit } from '@angular/core';
import { TurnoService } from '../turno.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Turno } from '../turno.model';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-alterar-turno',
  templateUrl: './alterar-turno.component.html',
  styleUrls: ['./alterar-turno.component.scss'],
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
export class AlterarTurnoComponent implements OnInit {
  public turno = new Turno();
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public feedbackUsuario: string;
  public exibirAlerta: boolean = false;

  constructor(
    private router: Router,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private turnoService: TurnoService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((turno: Turno) => {
      this.turno.id = turno.id;
      this.turno.nome = turno.nome;
      this.turno.horaInicio = turno.horaInicio;
      this.turno.horaFim = turno.horaFim;
      this.turno.abreviatura = turno.abreviatura
    });
  }

  public alterar(): void {
    this.feedbackUsuario = "Salvando dados, aguarde...";
    this.turnoService
      .alterar(this.turno)
      .toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = undefined;
        this.router.navigateByUrl("listar-turno");
      })
      .catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.exibirAlerta = true;
        this.feedbackUsuario = undefined;
      });
  }

  public listar(): void {
    this.router.navigateByUrl("listar-turno");
  }

  public modificarInputs(event: Event): void {
    let campo: string = (<HTMLInputElement>event.target).name;
    let valor: string = (<HTMLInputElement>event.target).value;
    this.turno[campo] = valor;
    this.validar(event);
  }

  public validar(event: Event) {
    Utils.validarCampos({ event: event });
    this.exibirAlerta = false;
  }

}
