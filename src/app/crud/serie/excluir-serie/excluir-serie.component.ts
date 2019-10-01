import { Component, OnInit } from '@angular/core';
import { SerieService } from '../serie.service';
import { EtapaEnsinoService } from '../../etapa-ensino/etapa-ensino.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Serie } from '../serie.model';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-excluir-serie',
  templateUrl: './excluir-serie.component.html',
  styleUrls: ['./excluir-serie.component.scss'],
  providers: [SerieService, EtapaEnsinoService],
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
export class ExcluirSerieComponent implements OnInit {

  public serie = new Serie();
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;

  constructor(
    private serieService: SerieService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((serie: any) => {
      this.serie = JSON.parse(serie["serie"]);
    });
  }

  public listar(): void {
    this.router.navigateByUrl("listar-serie");
  }

  public excluir(): void {
    this.feedbackUsuario = "Excluindo dados dados, aguarde...";
    this.serieService
      .excluir(this.serie.id)
      .toPromise()
      .then((response: Response) => {
        this.router.navigateByUrl("listar-serie");
        this.feedbackUsuario = undefined;
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
        this.feedbackUsuario = undefined;
      });
  }

}
