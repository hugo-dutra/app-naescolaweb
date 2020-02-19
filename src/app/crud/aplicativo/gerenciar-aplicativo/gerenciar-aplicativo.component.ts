import { Component, OnInit } from '@angular/core';
import { EstudanteService } from '../../estudante/estudante.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Utils } from '../../../shared/utils.shared';
import { Router, ActivatedRoute } from '@angular/router';
import { AcessoComumService } from '../../../shared/acesso-comum/acesso-comum.service';
import { HintService } from 'angular-custom-tour';

@Component({
  selector: 'ngx-gerenciar-aplicativo',
  templateUrl: './gerenciar-aplicativo.component.html',
  styleUrls: ['./gerenciar-aplicativo.component.scss'],
  providers: [EstudanteService, FirebaseService, HintService],
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
export class GerenciarAplicativoComponent implements OnInit {

  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public arrayOfEstudantesAplicativo = new Array<Object>();
  public esc_id: number;
  public dados_escola: Object;

  constructor(
    private router: Router,
    private hintService: HintService,
    private acessoComumService: AcessoComumService,
  ) { }

  ngOnInit() {
    this.dados_escola = JSON.parse(
      Utils.decriptAtoB(
        localStorage.getItem("dados_escola"),
        CONSTANTES.PASSO_CRIPT
      )
    )[0];
    this.esc_id = parseInt(this.dados_escola["id"]);
    this.subscribeTour();
  }



  public subscribeTour(): void {
    this.acessoComumService.emitirAlertaInicioTour.subscribe(() => {
      this.hintService.initialize({ elementsDisabled: false });
    })
  }



  public sincronizarAplicativo(): void {
    this.router.navigate([`${this.router.url}/sincronizar-estudante-aplicativo`]);
  }

  public gerarQrcodeAplicativoEstudante(): void {
    this.router.navigate([`${this.router.url}/gerar-qrcode-aplicativo-estudante`])
  }

  public gerarQrcodeAplicativoAdministrativo(): void {
    this.router.navigate([`${this.router.url}/gerar-qrcode-aplicativo-administrativo`])
  }

  public baixarFotosEstudanteAplicativo(): void {
    this.router.navigate([`${this.router.url}/baixar-foto-estudante-aplicativo`]);
  }

  public gravarTipoOcorrenciaAplicativoAdministrativo(): void {
    this.router.navigate([`${this.router.url}/gravar-tipo-ocorrencia-aplicativo-administrativo`]);
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }


}
