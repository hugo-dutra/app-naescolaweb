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

@Component({
  selector: 'ngx-inserir-portaria',
  templateUrl: './inserir-portaria.component.html',
  styleUrls: ['./inserir-portaria.component.scss'],
  providers: [PortariaService],
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
    private portariaService: PortariaService) { }

  public portaria: Portaria = new Portaria();
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;
  public esc_id: number;

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

  ngOnInit() {
    this.esc_id = Utils.pegarDadosEscola()["id"];
    this.feedbackUsuario = undefined;
  }
  public listar(): void {
    this.router.navigate([`${this.route.parent.routeConfig.path}/listar-portaria`]);
  }

  public inserir(): void {
    this.portaria.esc_id = this.esc_id;
    this.portaria.inicioMatutino = this.formulario.value.inicioMatutino;
    this.portaria.fimMatutino = this.formulario.value.fimMatutino;
    this.portaria.toleranciaEntradaMatutino = this.formulario.value.toleranciaEntradaMatutino;
    this.portaria.toleranciaSaidaMatutino = this.formulario.value.toleranciaSaidaMatutino;
    this.portaria.inicioVespertino = this.formulario.value.inicioVespertino;
    this.portaria.fimVespertino = this.formulario.value.fimVespertino;
    this.portaria.toleranciaEntradaVespertino = this.formulario.value.toleranciaEntradaVespertino;
    this.portaria.toleranciaSaidaVespertino = this.formulario.value.toleranciaSaidaVespertino;
    this.portaria.inicioNoturno = this.formulario.value.inicioNoturno;
    this.portaria.fimNoturno = this.formulario.value.fimNoturno;
    this.portaria.toleranciaEntradaNoturno = this.formulario.value.toleranciaEntradaNoturno;
    this.portaria.toleranciaSaidaNoturno = this.formulario.value.toleranciaSaidaNoturno;
    this.portaria.nome = this.formulario.value.nome;
    this.portaria.inicioIntegral = this.formulario.value.inicioIntegral;
    this.portaria.fimIntegral = this.formulario.value.fimIntegral;
    this.portaria.toleranciaEntradaIntegral = this.formulario.value.toleranciaEntradaIntegral;
    this.portaria.toleranciaSaidaIntegral = this.formulario.value.toleranciaSaidaIntegral;

    this.feedbackUsuario = "Salvando dados, aguarde...";
    this.portariaService.inserir(this.portaria).toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = undefined;
        this.formulario.reset();
        this.exibirAlerta = false;
      }).catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      })
  }

  public validar(event: Event) {
    Utils.validarCampos({ event: event });
    this.exibirAlerta = false;
  }


}
