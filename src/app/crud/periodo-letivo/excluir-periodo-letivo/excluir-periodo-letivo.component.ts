import { Component, OnInit } from '@angular/core';
import { PeriodoLetivoService } from '../periodo-letivo.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { PeriodoLetivo } from '../periodo-letivo.model';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-excluir-periodo-letivo',
  templateUrl: './excluir-periodo-letivo.component.html',
  styleUrls: ['./excluir-periodo-letivo.component.scss'],
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
export class ExcluirPeriodoLetivoComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private periodoLetivoService: PeriodoLetivoService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router
  ) { }
  public periodoLetivo = new PeriodoLetivo();
  public estado: string = "visivel";
  public feedbackUsuario: string;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;

  ngOnInit() {
    this.route.queryParams.subscribe((periodoLetivo: PeriodoLetivo) => {
      this.periodoLetivo = JSON.parse(periodoLetivo["periodoLetivo"]);
      this.periodoLetivo.inicio = this.periodoLetivo.inicio.toString().split('T')[0];
      this.periodoLetivo.fim = this.periodoLetivo.fim.toString().split('T')[0];
    });
  }

  public excluir(): void {
    this.feedbackUsuario = "Excluindo dados, aguarde...";
    this.periodoLetivoService
      .excluir(this.periodoLetivo.id)
      .toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = undefined;
        this.router.navigateByUrl("listar-periodo-letivo");
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

  public listar(): void {
    this.router.navigate(["listar-periodo-letivo"]);
  }

}
