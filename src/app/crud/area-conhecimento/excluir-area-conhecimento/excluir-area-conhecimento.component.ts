import { Component, OnInit } from '@angular/core';
import { AreaConhecimentoService } from '../area-conhecimento.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { AreaConhecimento } from '../area-conhecimento.model';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-excluir-area-conhecimento',
  templateUrl: './excluir-area-conhecimento.component.html',
  styleUrls: ['./excluir-area-conhecimento.component.scss'],
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
export class ExcluirAreaConhecimentoComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private areaConhecimentoService: AreaConhecimentoService
  ) { }

  public areaConhecimento = new AreaConhecimento();
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;

  ngOnInit() {
    this.route.queryParams.subscribe((area: any) => {
      this.areaConhecimento = JSON.parse(area["area"]);
    });
  }

  public listar() {
    this.router.navigateByUrl("listar-area-conhecimento");
  }

  public excluir() {
    this.feedbackUsuario = "Excluindo dados, aguarde...";
    this.areaConhecimentoService
      .excluir(this.areaConhecimento.id)
      .toPromise()
      .then((response: Response) => {
        this.router.navigateByUrl("listar-area-conhecimento");
        this.feedbackUsuario = undefined;
      })
      .catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro.json()["message"]);
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      });
  }

}
