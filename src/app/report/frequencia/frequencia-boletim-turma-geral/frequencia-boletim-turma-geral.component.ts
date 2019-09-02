import { Component, OnInit } from '@angular/core';
import { BoletimEstudanteService } from '../../../crud/boletim-estudante/boletim-estudante.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Utils } from '../../../shared/utils.shared';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TurmaService } from '../../../crud/turma/turma.service';

@Component({
  selector: 'ngx-frequencia-boletim-turma-geral',
  templateUrl: './frequencia-boletim-turma-geral.component.html',
  styleUrls: ['./frequencia-boletim-turma-geral.component.scss'],
  providers: [BoletimEstudanteService, TurmaService],
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
export class FrequenciaBoletimTurmaGeralComponent implements OnInit {
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public esc_id: number;
  public arrayOfFaltasEstudantes = new Array<Object>();
  public arrayOfTurmas = new Array<object>();
  public anoAtual: number;
  public stringTurmaSelecionada: string = "Selecione uma turma...";

  constructor(
    private boletimEstudanteService: BoletimEstudanteService,
    private turmaService: TurmaService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.esc_id = parseInt(Utils.decriptAtoB(localStorage.getItem('esc_id'), CONSTANTES.PASSO_CRIPT));
    this.anoAtual = (new Date).getFullYear();
    this.listarTurmas();

  }

  public gerenciarRelatorioFrequencia(): void {
    this.router.navigate([this.route.parent.routeConfig.path]);
  }


  public listarFaltasEstudantesBoletim(esc_id: number, trm_id: number): void {
    this.feedbackUsuario = 'Carregando faltas dos estudantes, aguarde...';
    this.boletimEstudanteService.listarFaltasTurmaGeralBoletim(esc_id, trm_id).toPromise().then((response: Response) => {
      this.feedbackUsuario = undefined;
      this.arrayOfFaltasEstudantes = Object.values(response);
      console.log(this.arrayOfFaltasEstudantes);
    }).catch((erro: Response) => {
      //Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      //registra log de erro no firebase usando serviço singlenton
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
      //Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
      this.feedbackUsuario = undefined;
    })
  }

  public listarTurmas(): void {
    this.feedbackUsuario = 'Listando turmas, aguarde...';
    this.turmaService.listarTodasAno(this.anoAtual, this.esc_id).toPromise().then((response: Response) => {
      this.feedbackUsuario = undefined;
      this.arrayOfTurmas = Object.values(response);
    }).catch((erro: Response) => {
      //Mostra modal
      this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
      //registra log de erro no firebase usando serviço singlenton
      this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro["message"]);
      //Caso token seja invalido, reenvia rota para login
      Utils.tratarErro({ router: this.router, response: erro });
      this.feedbackUsuario = undefined;
    })
  }

  public selecionarTurma(event: Event): void {
    const trm_id_selecionada = parseInt((<HTMLInputElement>event.target).id);
    this.stringTurmaSelecionada = ((<HTMLInputElement>event.target).name);
    this.listarFaltasEstudantesBoletim(this.esc_id, trm_id_selecionada);
  }

  public tendenciaFaltasEstudante(estudante: Object): void {
    alert(`Aqui, gráfico de: ${JSON.stringify(estudante['estudante'])}`);
  }

}
