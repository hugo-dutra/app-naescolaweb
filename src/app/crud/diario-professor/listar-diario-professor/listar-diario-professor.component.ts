import { Component, OnInit } from '@angular/core';
import { DiarioProfessorService } from '../diario-professor.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-listar-diario-professor',
  templateUrl: './listar-diario-professor.component.html',
  styleUrls: ['./listar-diario-professor.component.scss'],
  providers: [DiarioProfessorService],
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
export class ListarDiarioProfessorComponent implements OnInit {

  public diariosProfessor = new Array<Object>()
  public estado: string = "visivel";
  public prd_id: number;
  private anoAtual: number;
  public feedbackUsuario: string;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public decrescente: boolean = true;

  constructor(
    private diarioProfessorService: DiarioProfessorService,
    private router: Router,
    private route: ActivatedRoute,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService) { }

  ngOnInit() {
    /* this.route.queryParams.subscribe((diarioProfessorDisciplina: Object) => {
      this.prd_id = JSON.parse(diarioProfessorDisciplina["diarioProfessorDisciplina"])["prd_id"];
    }); */
    this.anoAtual = (new Date()).getFullYear();
    this.listarDiariosProfessor();
  }

  public listarDiariosProfessor(): void {
    this.feedbackUsuario = "Listando turmas associadas ao professor na disciplina informda..."
    this.diarioProfessorService.listarDiarioProfessorDisciplinaIdAno(this.prd_id, this.anoAtual)
      .toPromise()
      .then((response: Response) => {
        this.diariosProfessor = Object.values(response);
        this.feedbackUsuario = undefined;
      }).catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      });
  }

  public gerenciarDiarios() {
    this.router.navigate([`${this.route.parent.routeConfig.path}`]);
  }

  public exibirComponente(rota: string): boolean {
    return Utils.exibirComponente(rota);
  }

  public ordenarColuna(campo: string): void {
    if (!this.decrescente) {
      let retorno = this.diariosProfessor.sort(function (a, b) {
        if (a[campo] < b[campo]) {
          return 1;
        }
        if (a[campo] > b[campo]) {
          return -1;
        }
        return 0;
      })
      this.diariosProfessor = retorno;

    } else {
      let retorno = this.diariosProfessor.sort(function (a, b) {
        if (a[campo] > b[campo]) {
          return 1;
        }
        if (a[campo] < b[campo]) {
          return -1;
        }
        return 0;
      })
      this.diariosProfessor = retorno;
    }
    this.decrescente = !this.decrescente;
  }

}
