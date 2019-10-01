import { Component, OnInit } from '@angular/core';
import { TipoOcorrenciaDisciplinarService } from '../tipo-ocorrencia-disciplinar.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { TipoOcorrenciaDisciplinar } from '../tipo-ocorrencia-disciplinar.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-excluir-tipo-ocorrencia-disciplinar',
  templateUrl: './excluir-tipo-ocorrencia-disciplinar.component.html',
  styleUrls: ['./excluir-tipo-ocorrencia-disciplinar.component.scss'],
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
export class ExcluirTipoOcorrenciaDisciplinarComponent implements OnInit {

  public tipoOcorrenciaDisciplinar = new TipoOcorrenciaDisciplinar();
  public feedbackUsuario: string;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;
  public estado: string = "visivel";

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

  public excluir(): void {
    this.feedbackUsuario = "Excluindo dados, aguarde...";
    this.tipoOcorrenciaDisciplinarService
      .excluir(this.tipoOcorrenciaDisciplinar.id)
      .toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = undefined;
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

  public listar(): void {
    this.router.navigateByUrl("listar-tipo-ocorrencia-disciplinar");
  }

}
