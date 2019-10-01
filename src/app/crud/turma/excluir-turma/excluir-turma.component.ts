import { Component, OnInit } from '@angular/core';
import { TurmaService } from '../turma.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Turma } from '../turma.model';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-excluir-turma',
  templateUrl: './excluir-turma.component.html',
  styleUrls: ['./excluir-turma.component.scss'],
  providers: [TurmaService],
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
export class ExcluirTurmaComponent implements OnInit {

  public turma = new Turma();
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;

  constructor(
    private router: Router,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private turmaService: TurmaService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((turma: any) => {
      this.turma = JSON.parse(turma["turma"]);
    });
  }

  public excluir(): void {
    this.feedbackUsuario = "Excluindo dados, aguarde...";
    this.turmaService
      .excluir(this.turma.id)
      .toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = undefined;
        this.listar();
      })
      .catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, JSON.stringify(erro));
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      });
  }

  public listar(): void {
    this.router.navigateByUrl("listar-turma");
  }

}
