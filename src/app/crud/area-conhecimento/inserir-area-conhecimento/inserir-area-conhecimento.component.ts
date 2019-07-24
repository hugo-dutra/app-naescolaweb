import { Component, OnInit } from '@angular/core';
import { AreaConhecimentoService } from '../area-conhecimento.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Router } from '@angular/router';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { AreaConhecimento } from '../area-conhecimento.model';
import { FormGroup, FormControl } from '@angular/forms';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-inserir-area-conhecimento',
  templateUrl: './inserir-area-conhecimento.component.html',
  styleUrls: ['./inserir-area-conhecimento.component.scss'],
  providers: [AreaConhecimentoService],
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
export class InserirAreaConhecimentoComponent implements OnInit {

  constructor(
    private areaConhecimentoService: AreaConhecimentoService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router
  ) { }

  public areaConhecimento = new AreaConhecimento();
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta = false;

  public formulario = new FormGroup({
    id: new FormControl(null),
    nome: new FormControl(null),
    abreviatura: new FormControl(null)
  });

  ngOnInit() {
  }

  public inserir(): void {
    this.areaConhecimento.id = this.formulario.value.id;
    this.areaConhecimento.nome = this.formulario.value.nome;
    this.areaConhecimento.abreviatura = this.formulario.value.abreviatura;

    this.feedbackUsuario = "Salvando dados, aguarde...";
    this.areaConhecimentoService
      .inserir(this.areaConhecimento)
      .toPromise()
      .then((response: Response) => {
        this.formulario.reset();
        this.feedbackUsuario = undefined;
        this.router.navigateByUrl("listar-area-conhecimento");
      })
      .catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro.json()["message"]);
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.exibirAlerta = true;
        this.feedbackUsuario = undefined;
      });
  }

  public listar() {
    this.router.navigateByUrl("listar-area-conhecimento");
  }

  public listarObjeto(): Object {
    return new AreaConhecimento();
  }

  public listarObjetos(): Object[] {
    return null;
  }

  public validar(event: Event) {
    Utils.validarCampos({ event: event });
    this.exibirAlerta = false;
  }
}
