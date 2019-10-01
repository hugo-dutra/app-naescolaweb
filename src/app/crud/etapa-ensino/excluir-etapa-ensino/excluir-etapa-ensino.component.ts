import { Component, OnInit } from '@angular/core';
import { EtapaEnsinoService } from '../etapa-ensino.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { EtapaEnsino } from '../etapa-ensino.model';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-excluir-etapa-ensino',
  templateUrl: './excluir-etapa-ensino.component.html',
  styleUrls: ['./excluir-etapa-ensino.component.scss'],
  providers: [EtapaEnsinoService],
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
export class ExcluirEtapaEnsinoComponent implements OnInit {

  public etapaEnsino = new EtapaEnsino();
  public estado: string = "visivel";
  public feedbackUsuario: string;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;

  public formulario = new FormGroup({
    id: new FormControl(null),
    nome: new FormControl(null),
    abreviatura: new FormControl(null)
  });

  constructor(
    private etapaEnsinoService: EtapaEnsinoService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((etapaEnsino: EtapaEnsino) => {
      this.etapaEnsino = JSON.parse(etapaEnsino["etapaEnsino"]);
    });
  }

  public excluir(): void {
    this.feedbackUsuario = "Exclindo dados, aguarde...";
    this.etapaEnsinoService
      .excluir(this.etapaEnsino.id)
      .toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = undefined;
        this.router.navigateByUrl("listar-etapa-ensino");
      })
      .catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
    //Gravar erros no analytics
    Utils.gravarErroAnalytics(JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.exibirAlerta = true;
        this.feedbackUsuario = undefined;
      });
  }

  public listar(): void {
    this.router.navigateByUrl("listar-etapa-ensino");
  }

}
