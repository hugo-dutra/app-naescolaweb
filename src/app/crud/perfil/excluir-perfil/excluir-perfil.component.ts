import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../perfil.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Utils } from '../../../shared/utils.shared';
import { Perfil } from '../perfil.model';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';

@Component({
  selector: 'ngx-excluir-perfil',
  templateUrl: './excluir-perfil.component.html',
  styleUrls: ['./excluir-perfil.component.scss'],
  providers: [PerfilService],
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
export class ExcluirPerfilComponent implements OnInit {

  public perfil = new Perfil();
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;

  constructor(
    private router: Router,
    private perfilService: PerfilService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((perfil: Perfil) => {
      this.perfil = JSON.parse(perfil["perfil"]);
    });
  }

  public excluir(): void {
    this.feedbackUsuario = "Excluindo dados, aguarde...";
    this.perfilService
      .excluir(this.perfil.id)
      .toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = undefined;
        this.listar();
      })
      .catch((erro: Response) => {
        //Mostra modal
        this.alertModalService.showAlertDanger(CONSTANTES.MSG_ERRO_PADRAO);
        //registra log de erro no firebase usando serviço singlenton
        this.firebaseService.gravarLogErro(`${this.constructor.name}\n${(new Error).stack.split('\n')[1]}`, erro.json()["message"]);
        //Caso token seja invalido, reenvia rota para login
        Utils.tratarErro({ router: this.router, response: erro });
        this.feedbackUsuario = undefined;
      });
  }

  public listar(): void {
    this.router.navigate(["listar-perfil"]);
  }

}
