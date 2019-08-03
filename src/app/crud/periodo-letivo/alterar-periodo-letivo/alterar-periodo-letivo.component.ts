import { Component, OnInit } from '@angular/core';
import { PeriodoLetivoService } from '../periodo-letivo.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { FormGroup, FormControl } from '@angular/forms';
import { PeriodoLetivo } from '../periodo-letivo.model';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-alterar-periodo-letivo',
  templateUrl: './alterar-periodo-letivo.component.html',
  styleUrls: ['./alterar-periodo-letivo.component.scss'],
  providers: [PeriodoLetivoService],
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
export class AlterarPeriodoLetivoComponent implements OnInit {

  constructor(
    private periodoLetivoService: PeriodoLetivoService,
    private route: ActivatedRoute,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router
  ) { }

  public formulario = new FormGroup({
    id: new FormControl(null),
    periodo: new FormControl(null),
    inicio: new FormControl(null),
    fim: new FormControl(null)
  });

  public periodoLetivo = new PeriodoLetivo();
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;
  public formularioValido: boolean = true;

  ngOnInit() {
    this.route.queryParams.subscribe((periodoLetivo: PeriodoLetivo) => {
      this.periodoLetivo.id = periodoLetivo.id;
      this.periodoLetivo.periodo = periodoLetivo.periodo;
      this.periodoLetivo.inicio = periodoLetivo.inicio;
      this.periodoLetivo.fim = periodoLetivo.fim;

      this.formulario.value.id = periodoLetivo.id;
      this.formulario.value.periodo = periodoLetivo.periodo;
      this.formulario.value.inicio = periodoLetivo.inicio;
      this.formulario.value.fim = periodoLetivo.fim;
    });
  }

  public listar(): void {
    this.router.navigate(["listar-periodo-letivo"]);
  }

  public alterar(): void {
    this.feedbackUsuario = "Salvando dados, aguarde...";
    this.periodoLetivoService
      .alterar(this.periodoLetivo)
      .toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = undefined;
        this.router.navigate(["listar-periodo-letivo"]);
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
  public modificarInputs(event: Event): void {
    let campo: string = (<HTMLInputElement>event.target).name;
    let valor: string = (<HTMLInputElement>event.target).value;
    this.periodoLetivo[campo] = valor;
    this.validar(event);
  }

  public validar(event: Event): void {
    Utils.validarCampos({
      event: event
    });
    this.exibirAlerta = false;
  }


}
