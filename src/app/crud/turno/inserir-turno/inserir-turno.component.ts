import { Component, OnInit } from '@angular/core';
import { TurnoService } from '../turno.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Turno } from '../turno.model';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-inserir-turno',
  templateUrl: './inserir-turno.component.html',
  styleUrls: ['./inserir-turno.component.scss'],
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
export class InserirTurnoComponent implements OnInit {

  public turno = new Turno();
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;

  constructor(
    private turnoService: TurnoService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router) { }

  public formulario = new FormGroup({
    id: new FormControl(null),
    nome: new FormControl(null),
    horaInicio: new FormControl(null),
    horaFim: new FormControl(null),
    abreviatura: new FormControl(null)
  });

  ngOnInit() { }

  public modificar(): void { }

  public inserir(): void {
    this.turno.nome = this.formulario.value.nome;
    this.turno.horaInicio = this.formulario.value.horaInicio;
    this.turno.horaFim = this.formulario.value.horaFim;
    this.turno.abreviatura = this.formulario.value.abreviatura;
    this.turno.esc_id = parseInt(Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT));
    this.feedbackUsuario = "Salvando dados, aguarde...";
    this.turnoService
      .inserir(this.turno)
      .toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = "Dados Salvos";
        this.formulario.reset();
        this.formulario.value;
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
        this.exibirAlerta = true;
      });
  }

  public listar(): void {
    this.router.navigateByUrl("listar-turno");
  }

  public enviarArquivo(event: Event): void { }

  public excluir(): void { }

  public listarObjeto(): Object {
    return null;
  }

  public listarObjetos(): Object[] {
    return null;
  }

  public validar(event: Event): void {
    Utils.validarCampos({ event: event });
    this.exibirAlerta = false;
  }

}
