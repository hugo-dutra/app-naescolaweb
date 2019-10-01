import { Component, OnInit } from '@angular/core';
import { TipoOcorrenciaDisciplinarService } from '../tipo-ocorrencia-disciplinar.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { TipoOcorrenciaDisciplinar } from '../tipo-ocorrencia-disciplinar.model';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-alterar-tipo-ocorrencia-disciplinar',
  templateUrl: './alterar-tipo-ocorrencia-disciplinar.component.html',
  styleUrls: ['./alterar-tipo-ocorrencia-disciplinar.component.scss'],
  providers: [TipoOcorrenciaDisciplinarService],
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
export class AlterarTipoOcorrenciaDisciplinarComponent implements OnInit {

  public tipoOcorrenciaDisciplinar = new TipoOcorrenciaDisciplinar();
  public feedbackUsuario: string;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;
  public estado: string = "visivel";

  public formulario = new FormGroup({
    id: new FormControl(null),
    nome: new FormControl(null),
    valor: new FormControl(null),
  });


  constructor(
    private tipoOcorrenciaDisciplinarService: TipoOcorrenciaDisciplinarService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((tipoOcorrenciaDisciplinar: TipoOcorrenciaDisciplinar) => {
      this.tipoOcorrenciaDisciplinar = JSON.parse(tipoOcorrenciaDisciplinar["tipoOcorrenciaDisciplinar"]);
    })
  }

  public alterar(): void {
    this.feedbackUsuario = "Salvando dados, aguarde...";
    this.tipoOcorrenciaDisciplinarService
      .alterar(this.tipoOcorrenciaDisciplinar)
      .toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = undefined;
        this.formulario.reset();
        this.router.navigateByUrl("listar-tipo-ocorrencia-disciplinar");
      })
      .catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
        this.exibirAlerta = true;
      });
  }

  public modificarInputs(event: Event) {
    let campo: string = (<HTMLInputElement>event.target).name;
    let valor: any = (<HTMLInputElement>event.target).value;
    this.tipoOcorrenciaDisciplinar[campo] = valor;
    this.validar(event);

  }

  public validar(event: Event) {
    Utils.validarCampos({ event: event });
    this.exibirAlerta = false;
  }

  public listar(): void {
    this.router.navigateByUrl("listar-tipo-ocorrencia-disciplinar");
  }

}
