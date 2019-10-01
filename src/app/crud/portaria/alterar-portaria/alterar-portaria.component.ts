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

@Component({
  selector: 'ngx-alterar-portaria',
  templateUrl: './alterar-portaria.component.html',
  styleUrls: ['./alterar-portaria.component.scss'],
  providers: [FirebaseService, PortariaService],
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
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;
  public esc_id: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private portariaService: PortariaService) { }

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

  }

  public alterar(): void {
    this.feedbackUsuario = "Salvando modificações, aguarde...";
    this.portariaService.alterar(this.portaria).toPromise().then(() => {
      this.feedbackUsuario = undefined;
      this.firebaseService.alterarConfiguracaoFirebaseFirestorePortaria(this.portaria);
      this.listar();
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

}
