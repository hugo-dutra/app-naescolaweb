import { Component, OnInit } from '@angular/core';
import { EstudanteService } from '../../estudante/estudante.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-listar-estudantes-turma',
  templateUrl: './listar-estudantes-turma.component.html',
  styleUrls: ['./listar-estudantes-turma.component.scss'],
  providers: [EstudanteService],
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
export class ListarEstudantesTurmaComponent implements OnInit {

  public arrayOfEstudantes: Array<Object>;
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public statusFiltro: boolean = false;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public trm_id: number;
  public serie: string = "";
  public turma: string = "";
  public turno: string = "";

  constructor(
    private route: ActivatedRoute,
    private estudanteService: EstudanteService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe((objetoEnviado: Object) => {
      this.trm_id = parseInt(JSON.parse(objetoEnviado["trm_id"]));
      this.serie = JSON.parse(objetoEnviado['serie']);
      this.turma = JSON.parse(objetoEnviado['turma']);
      this.turno = JSON.parse(objetoEnviado['turno']);
    });
    this.listarEstudantesTurma();
  }

  public listarTurmas() {
    this.router.navigate(["listar-turma"]);
  }

  public listarEstudantesTurma(): void {
    this.feedbackUsuario = "Listando estudantes, aguarde...";
    this.estudanteService.listarTurmaId(this.trm_id).toPromise().then((response: Response) => {
      this.feedbackUsuario = undefined;
      this.arrayOfEstudantes = Object.values(response);
    }).catch((erro: Response) => {
      //Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      //registra log de erro no firebase usando servi??o singlenton
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
      //Gravar erros no analytics
      Utils.gravarErroAnalytics(JSON.stringify(erro));
      //Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
      this.feedbackUsuario = undefined;
    })
  }

  public alterarNumeroChamada(est_id: number, trm_id: number, event: Event): void {
    setTimeout(() => {
      const novoNumero = parseInt((<HTMLInputElement>event.target).value);
      this.feedbackUsuario = "Alterando n??mero...";
      this.estudanteService
        .alterarManualNumeroChamada(est_id, trm_id, novoNumero)
        .toPromise()
        .then(() => {
          this.feedbackUsuario = undefined;
          this.alertModalService.showAlertSuccess("N??mero alterado!!!");
        }).catch((erro: Response) => {
          //Mostra modal
          this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
          //registra log de erro no firebase usando servi??o singlenton
          this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
          //Gravar erros no analytics
          Utils.gravarErroAnalytics(JSON.stringify(erro));
          //Caso token seja invalido, reenvia rota para login
          Utils.tratarErro({ router: this.router, response: erro });
          this.feedbackUsuario = undefined;
        })
    }, 1000);
  }

}
