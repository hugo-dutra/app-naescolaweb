import { Component, OnInit } from '@angular/core';
import { RegiaoEscolaService } from '../regiao-escola.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { RegiaoEscola } from '../regiao-escola.model';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Utils } from '../../../shared/utils.shared';

@Component({
  selector: 'ngx-excluir-regiao-escola',
  templateUrl: './excluir-regiao-escola.component.html',
  styleUrls: ['./excluir-regiao-escola.component.scss'],
  providers: [RegiaoEscolaService],
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
export class ExcluirRegiaoEscolaComponent implements OnInit {

  public regiaoEscola = new RegiaoEscola();
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;

  constructor(
    private regiaoEscolaService: RegiaoEscolaService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((regiaoEscola: RegiaoEscola) => {
      this.regiaoEscola = JSON.parse(regiaoEscola["regiaoEscola"]);
    });
  }

  public listar(): void {
    this.router.navigateByUrl("listar-regiao-escola");
  }

  public excluir(): void {
    this.feedbackUsuario = "Excluindo dados dados, aguarde...";
    this.regiaoEscolaService
      .excluir(this.regiaoEscola.id)
      .toPromise()
      .then((response: Response) => {
        this.router.navigateByUrl("listar-regiao-escola");
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
