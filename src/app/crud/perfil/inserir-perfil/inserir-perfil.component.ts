import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../perfil.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONSTANTES } from '../../../shared/constantes.shared';
import { Utils } from '../../../shared/utils.shared';
import { Perfil } from '../perfil.model';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertModalService } from '../../../shared-module/alert-modal.service';
import { FirebaseService } from '../../../shared/firebase/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-inserir-perfil',
  templateUrl: './inserir-perfil.component.html',
  styleUrls: ['./inserir-perfil.component.scss'],
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
export class InserirPerfilComponent implements OnInit {


  public perfil = new Perfil();
  public escoposPerfil = new Array<Object>();
  public feedbackUsuario: string;
  public estado: string = "visivel";
  public gif_width: number = CONSTANTES.GIF_WAITING_WIDTH;
  public gif_heigth: number = CONSTANTES.GIF_WAITING_HEIGTH;
  public exibirAlerta: boolean = false;

  public formulario = new FormGroup({
    id: new FormControl(null),
    nome: new FormControl(null)
  });

  constructor(private perfilService: PerfilService,
    private alertModalService: AlertModalService,
    private firebaseService: FirebaseService,
    private router: Router) { }

  ngOnInit() {
    this.listarEscopoPerfil();
  }

  public listarEscopoPerfil(): void {
    this.feedbackUsuario = "Carregando escopos de acesso, acesso...";
    this.perfilService.listarEscopoPerfil().toPromise().then((response: Response) => {
      this.escoposPerfil = Object.values(response);
      this.feedbackUsuario = undefined;
      console.log(this.escoposPerfil);
    })
  }

  public inserir(): void {
    this.perfil.nome = this.formulario.value.nome;
    this.feedbackUsuario = "Gravando dados, aguarde...";
    this.perfilService
      .inserir(this.perfil)
      .toPromise()
      .then((response: Response) => {
        this.feedbackUsuario = undefined;
        this.formulario.reset();
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
        this.exibirAlerta = true;
        this.feedbackUsuario = undefined;
      });
  }

  public listar(): void {
    this.router.navigate(["listar-perfil"]);
  }

  public validar(event: Event) {
    Utils.validarCampos({ event: event });
    this.exibirAlerta = false;
  }
}
