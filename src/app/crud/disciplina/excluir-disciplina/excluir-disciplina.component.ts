import { Component, OnInit } from '@angular/core';
import { DisciplinaService } from '../disciplina.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Disciplina } from '../disciplina.model';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-excluir-disciplina',
  templateUrl: './excluir-disciplina.component.html',
  styleUrls: ['./excluir-disciplina.component.scss'],
  providers: [DisciplinaService],
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
export class ExcluirDisciplinaComponent implements OnInit {

  public disciplina = new Disciplina();
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;

  constructor(
    private disciplinaService: DisciplinaService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((disciplina: any) => {
      this.disciplina = JSON.parse(disciplina["disciplina"]);
    });
  }

  public listar(): void {
    this.router.navigate(['listar-disciplina']);
  }

  public excluir(): void {
    this.feedbackUsuario = "Excluindo dados, aguarde...";
    this.disciplinaService
      .excluir(this.disciplina.id)
      .toPromise()
      .then((response: Response) => {
        this.router.navigateByUrl("listar-disciplina");
        this.feedbackUsuario = undefined;
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
}
