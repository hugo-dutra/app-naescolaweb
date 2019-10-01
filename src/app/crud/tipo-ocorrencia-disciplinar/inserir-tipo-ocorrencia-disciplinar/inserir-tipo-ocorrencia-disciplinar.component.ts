import { Component, OnInit } from '@angular/core';
import { TipoOcorrenciaDisciplinarService } from '../tipo-ocorrencia-disciplinar.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { TipoOcorrenciaDisciplinar } from '../tipo-ocorrencia-disciplinar.model';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-inserir-tipo-ocorrencia-disciplinar',
  templateUrl: './inserir-tipo-ocorrencia-disciplinar.component.html',
  styleUrls: ['./inserir-tipo-ocorrencia-disciplinar.component.scss'],
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
export class InserirTipoOcorrenciaDisciplinarComponent implements OnInit {
  public tipoOcorrenciaDisciplinar = new TipoOcorrenciaDisciplinar();
  public estado: string = "visivel";
  public feedbackUsuario: string;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;

  public formulario = new FormGroup({
    id: new FormControl(null),
    nome: new FormControl(null),
    valor: new FormControl(null)
  });
  constructor(
    private tipoOcorrenciaDisciplinarService: TipoOcorrenciaDisciplinarService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  public validar(event: Event) {
    Utils.validarCampos({ event: event });
    this.exibirAlerta = false;
  }

  public inserir(): void {
    this.tipoOcorrenciaDisciplinar.nome = this.formulario.value.nome;
    this.tipoOcorrenciaDisciplinar.valor = this.formulario.value.valor;
    this.tipoOcorrenciaDisciplinar.esc_id = parseInt(
      Utils.decriptAtoB(localStorage.getItem("esc_id"), CONSTANTES.PASSO_CRIPT)
    );
    this.feedbackUsuario = "Salvando dados, aguarde...";
    this.tipoOcorrenciaDisciplinarService
      .inserir(this.tipoOcorrenciaDisciplinar)
      .toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = undefined;
        this.formulario.reset();
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

  public listar(): void {
    this.router.navigateByUrl("listar-tipo-ocorrencia-disciplinar");
  }
}
