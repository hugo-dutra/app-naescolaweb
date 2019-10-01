import { Component, OnInit } from '@angular/core';
import { ProfessorService } from '../../professor/professor.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-listar-turma-disciplina-professor',
  templateUrl: './listar-turma-disciplina-professor.component.html',
  styleUrls: ['./listar-turma-disciplina-professor.component.scss'],
  providers: [ProfessorService],
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
export class ListarTurmaDisciplinaProfessorComponent implements OnInit {

  public estado: string = "visivel";
  public feedbackUsuario: string;
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public arrayOfProfessorDisciplinasTurmas: Array<Object>;
  public anoAtual: number;

  public dados_escola = new Array<Object>();
  public dados_usuario = new Array<Object>();
  public usr_id: number;
  public esc_id: number;

  constructor(
    private professorService: ProfessorService,
    private firebaseService: FirebaseService,
    private alertModalService: AlertModalService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    this.dados_escola = JSON.parse(
      Utils.decriptAtoB(
        localStorage.getItem("dados_escola"),
        CONSTANTES.PASSO_CRIPT
      )
    )[0];
    this.dados_usuario = JSON.parse(
      Utils.decriptAtoB(localStorage.getItem("dados"), CONSTANTES.PASSO_CRIPT)
    )[0];
    this.esc_id = parseInt(this.dados_escola["id"]);
    this.usr_id = parseInt(this.dados_usuario["id"]);

    this.carregarInformacoesIniciais();
    this.carregarTurmasDisciplinas();
  }

  public carregarTurmasDisciplinas(): void {
    this.feedbackUsuario = "Carregando turmas e disciplinas, aguarde..."
    this.professorService.listarTurmaDisciplina(this.esc_id, this.usr_id, this.anoAtual).toPromise().then((response: Response) => {
      this.feedbackUsuario = undefined;
      this.arrayOfProfessorDisciplinasTurmas = Object.values(response);
    }).catch((erro: Response) => {
      //Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      //registra log de erro no firebase usando serviço singlenton
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
    //Gravar erros no analytics
    Utils.gravarErroAnalytics(JSON.stringify(erro));
      //Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
      this.feedbackUsuario = undefined
    })
  }

  public carregarInformacoesIniciais(): void {
    this.anoAtual = (new Date()).getFullYear();
  }

  public gerenciarDiarioRegistro(): void {
    this.router.navigate(['gerenciar-diario-registro']);
  }

  public lancarNotas(dsp_id: number, trm_id: number, serie: string, turma: string, turno: string, etapa: string): void {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        dsp_id: dsp_id,
        trm_id: trm_id,
        serie: serie,
        turma: turma,
        turno: turno,
        etapa: etapa
      }
    };
    this.router.navigate([`${this.route.parent.routeConfig.path}/lancar-manual-nota-bimestral-conselho`], navigationExtras);
  }


}
