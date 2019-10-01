import { Component, OnInit } from '@angular/core';
import { PeriodoLetivoService } from '../periodo-letivo.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router } from '@angular/router';
import { PeriodoLetivo } from '../periodo-letivo.model';
import { FormGroup, FormControl } from '@angular/forms';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-inserir-periodo-letivo',
  templateUrl: './inserir-periodo-letivo.component.html',
  styleUrls: ['./inserir-periodo-letivo.component.scss'],
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
export class InserirPeriodoLetivoComponent implements OnInit {

  constructor(
    private periodoLetivoService: PeriodoLetivoService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router
  ) { }

  public periodoLetivo = new PeriodoLetivo();
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public formularioValid: boolean = false;
  public exibirAlerta = false;
  public formulario = new FormGroup({
    id: new FormControl(null),
    periodo: new FormControl(null),
    inicio: new FormControl(null),
    fim: new FormControl(null)
  });

  ngOnInit() {
    this.periodoLetivo.id = null;
    this.periodoLetivo.periodo = null;
    this.periodoLetivo.inicio = null;
    this.periodoLetivo.fim = null;
  }

  public modificar(): void { }

  public inserir(): void {
    this.periodoLetivo.periodo = this.formulario.value.periodo;
    this.periodoLetivo.inicio = this.formulario.value.inicio;
    this.periodoLetivo.fim = this.formulario.value.fim;
    this.feedbackUsuario = "Salvando dados, aguarde...";
    this.periodoLetivoService
      .inserir(this.periodoLetivo)
      .toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = "Dados Salvos";
        this.formulario.reset();
        this.feedbackUsuario = undefined;
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

  public enviarArquivo(event: Event): void {
    //Método não será implementado pois essa entidade não possui imagem
  }

  public listar(): void {
    this.router.navigate(["listar-periodo-letivo"]);
  }

  public excluir(): void { }

  public listarObjeto(): Object {
    return null;
  }

  public listarObjetos(): Object[] {
    return null;
  }

  public validar(event: Event): void {
    Utils.validarCampos({
      event: event
    });
    this.exibirAlerta = false;
  }

}
